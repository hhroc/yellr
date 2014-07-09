import os
import json
from time import strftime
import uuid

import urllib

import transaction

from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .mediahelper import registermedia

from .models import (
    DBSession,
    UserTypes,
    Users,
    Assignments,
    Questions,
    QuestionAssignments,
    Languages,
    Posts,
    MediaTypes,
    MediaObjects,
    PostMediaObjects,
    ClientLogs,
    Collections,
    CollectionPosts,
    )

system_status = {
    'alive': True,
    'launchtime': str(strftime("%Y-%m-%d %H:%M:%S")),
}

system_config = {
    'upload_dir': './uploads',
}

@view_config(route_name='index.html')
def index(request):
    resp = """

    <html>
    <body>
    <h3>Media Upload Test</h3><br>
    <form action="/uploadmedia.json" method="post" accept-charset="utf-8" enctype="multipart/form-data">
        <input id="mediafile" name="mediafile" type="file" value="test.txt" />
        <input id="clientid" name="clientid" type="text" value="{0}" />
        <input id="mediatype" name="mediatype" type="text" value="text">
        <input type="submit" value="submit" />
    </form>
    </body>

    <br>

    <h3>Upload Test</h3><br>
    <form action="/publishpost.json" method="post" accept-charset="utf-8" enctype="multipart/form-data">
        <input id="clientid" name="clientid" type="text" value="{0}">
        <input id="assignmentid" name="assignmentid" type="text" value="{0}">
        <input id="languagecode" name="languagecode" type="text" value="en">
        <input id="location" name="location" type="text" value="{1}">
        <input id="mediaobjects" name="mediaobjects" type="text" value="{2}">
        <input type="submit" value="submit" />
    </form>

    <h3>Upload Test</h3><br>
    <form action="/uploadtest.json" method="post" accept-charset="utf-8" enctype="multipart/form-data">
        <input id="sometext" name="sometext" type="text" value="This is a test!">
        <input type="submit" value="submit" />
    </form>

    </html>
    """.format(uuid.uuid4(),"{%22lat%22: 44, %22lng%22: -77}","[%220c13911e-da0a-439e-879d-06289646b704%22]")

    return Response(resp)

@view_config(route_name='status.json')
def status(request):
    resp = json.dumps(system_status)
    return Response(resp,content_type="application/json")

@view_config(route_name='uploadtest.json')
def uploadtest(request):

    result = {'success': False}

    #try:
    if True:

        sometext = request.POST['sometext']

        result['sometext'] = sometext
        result['success'] = True

    #except:
    #    pass

    resp = json.dumps(result)
    return Response(resp,content_type="application/json")

@view_config(route_name='publishpost.json')
def publishpost(request):

    """
    HTTP POST with the following fields:

    clientid, type: text (unique client id)
    assignmentid, type: text ( '' for no assignment)
    languagecode, type: text (two letter language code)
    location, type: text (json dict of lat and lng)
    mediaobjects, type: text (json array of media id's)

    """

    result = {'success': False}

    #try:
    if True:

        clientid = request.POST['clientid']
        assignmentid = request.POST['assignmentid']
        languagecode = request.POST['languagecode']
        location = json.loads(urllib.unquote(request.POST['location']).decode('utf8'))
        mediaobjects = json.loads(urllib.unquote(request.POST['mediaobjects']).decode('utf8'))

        post,created = Posts.create_from_http(
            DBSession,
            clientid,
            assignmentid,
            languagecode,
            location, # dict
            mediaobjects, # array
        )

        result['success'] = True
        result['postid'] = post.post_id
        result['newuser'] = created

    #except:
    #   pass

    resp = json.dumps(result)
    return Response(resp,content_type="application/json") 

@view_config(route_name='uploadmedia.json')
def uploadmedia(request):

    """
    HTTP POST with the following fields:

    mediafile, type: file
    clientid, type: text
    mediatype, type: text
        where valid mediatypes are: 'text', 'audio', 'video', 'image'

    optional fields:
    
    mediatext, type: text
    mediacaption, type: text

    """

    result = {'success': False}

    #try:
    if True:

        # get required fields
        client_id = request.POST['clientid']
        media_type = request.POST['mediatype']

        media_file_name = ''
        try:

            media_file_name = request.POST['mediafile'].filename
            input_file = request.POST['mediafile'].file

            # decode media type
            if mediatype == 'image':
                media_extention  = 'jpg'
            elif media_type == 'video':
                media_extention = 'mpg'
            elif media_type == 'audio':
                media_extention = 'mp3'
            elif media_type == 'text':
                media_extention = 'txt'
            else:
                raise Exception('invalid media type')
        
            # generate a unique file name to store the file to
            temp_file_name = '{0}.{1}'.format(uuid.uuid4(),media_extention)
            file_path = os.path.join(system_config['upload_dir'], temp_file_name)

            # write file to temp location, and then to disk
            temp_file_path = file_path + '~'
            output_file = open(temp_file_path, 'wb')
 
            # Finally write the data to disk
            input_file.seek(0)
            while True:
                data = input_file.read(2<<16)
                if not data:
                    break
                output_file.write(data)

            # rename once we are valid
            os.rename(temp_file_path, file_path)

        except:
            media_file_name = ''
            pass

        media_caption = ''
        try:
            media_caption = requst.POST['caption']
        except:
            pass

        media_text = ''
        try:
            media_text = request.POST['mediatext']
        except:
            pass


        # register file with database, and get file id back
        with transaction.manager:
            media_object = MediaObjects.create_new_media_object(
                DBSession,
                client_id,
                media_type,
                media_file_name,
                media_caption,
                media_text,
            )

        result['mediaid'] = media_object.unique_id
        result['success'] = True
        
        # Debug/Logging
        datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
        event_details = {
            'eventype': 'http_request',
            'url':'uploadmedia.json',
            'datetime': datetime,
            'clientid': client_id,
            'mediatype': media_type,
            'filename': media_file_name,
            'mediacaption': media_caption,
            'mediatext': media_text,
            'success': result['success'],
            'mediaid': result['mediaid'],
        }
        clientlog = ClientLogs.log(DBSession,client_id,json.dumps(event_details))

    #except:
    #    pass


    resp = json.dumps(result)
    return Response(resp,content_type="application/json")


#@view_config(route_name='home', renderer='templates/mytemplate.pt')
#def my_view(request):
#    try:
#        one = DBSession.query(MyModel).filter(MyModel.name == 'one').first()
#    except DBAPIError:
#        return Response(conn_err_msg, content_type='text/plain', status_int=500)
#    return {'one': one, 'project': 'yellr-serv'}


conn_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to run the "initialize_yellr-serv_db" script
    to initialize your database tables.  Check your virtual
    environment's "bin" directory for this script and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""

