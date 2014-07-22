import os
import json
from time import strftime
import uuid
import datetime

import urllib

import transaction

from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

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
    EventLogs,
    Collections,
    CollectionPosts,
    Messages,
    )

system_status = {
    'alive': True,
    'launchtime': str(strftime("%Y-%m-%d %H:%M:%S")),
}

system_config = {
    'upload_dir': './uploads',
}

def make_response(resp_dict):
    resp = Response(json.dumps(resp_dict), content_type='application/json', charset='utf8')
    resp.headerlist.append(('Access-Control-Allow-Origin', '*'))
    return resp

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

@view_config(route_name='json_test')
def jsonp_test(request):
    return make_response({'greeting':'hello world!'})

@view_config(route_name='status.json')
def status(request):

    """
    This is used as a method to deturmine of the server is alive.
    """

    resp = json.dumps(system_status)
    return Response(resp,content_type="application/json")

@view_config(route_name='client_logs.json')
def client_log(request):

    """
    This is for debug use only.  Returns all of the event logs in the system.
    """

    # get all of the client logs in the system
    # note: this could be a LOT of logs.
    logs = EventLogs.get_all(DBSession)

    retlogs = []
    for log in logs:
        retlogs.append({
            'event_log_id': log.event_log_id,
            'user_id': log.user_id,
            'event_type': log.event_type,
            'event_datetime': str(log.event_datetime),
            'details': json.loads(log.details),
        })
    resp = json.dumps(retlogs)
    return Response(resp,content_type='application/json')

@view_config(route_name='upload_test.json')
def upload_test(request):

    result = {'success': False}

    #try:
    if True:

        sometext = request.POST['some_text']

        result['sometext'] = sometext
        result['success'] = True

    #except:
    #    pass

    resp = json.dumps(result)
    return Response(resp,content_type='application/json')

@view_config(route_name='get_messages.json')
def get_messages(request):

    """
    HTTP GET with with the following fields:

    clientid, type: text (unique client id)

    This returns all of the messages that haven't been read by the client id.
    """

    result = { 'success': False }

    #try:
    if True:

        client_id = request.GET['client_id']

        messages = Messages.get_messages_from_client_id(
            DBSession,
            client_id,
        )
       
        retmessages =[] 
        for message in messages:
            
            from_user = Users.get_from_user_id(DBSession,message.from_user_id)
            from_organization = None
            if from_user != None:
                from_organization = user.organization
            retmessages.append({
                'from_user_id': message.from_user_id,
                'from_organization': from_organization,
                'to_user_id': message.to_user_id,
                'message_datetime': str(message.message_datetime),
                'parent_message_id': message.parent_message_id,
                'subject': message.subject,
                'text': message.text,
            })

        result['success'] = True
        result['messages'] = retmessages

    #except:
    #    pass

    #resp = json.dumps(result)
    #return Response(resp, content_type='application/json')

    return make_response(result)

@view_config(route_name='get_posts.json')
def get_posts(request):

    """
    Return all of the posts on the server
    """

    result = {'success': False}

    #try:
    if True:

        posts = Posts.get_all_posts(DBSession)

        print posts

        ret_posts = []
        for post in posts:
            ret_posts.append({
                'label':'hi',
            })

        result['posts'] = ret_posts
        result['succes'] = True

    #except:
    #    pass

    resp = json.dumps(result)
    return Response(resp, content_type='application/json')

@view_config(route_name='publish_post.json')
def publish_post(request):

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

        client_id = request.POST['client_id']
        assignment_id = request.POST['assignment_id']
        language_code = request.POST['language_code']
        location = json.loads(urllib.unquote(request.POST['location']).decode('utf8'))
        media_objects = json.loads(urllib.unquote(request.POST['media_objects']).decode('utf8'))

        post,created = Posts.create_from_http(
            DBSession,
            client_id,
            assignment_id,
            language_code,
            location, # dict
            media_objects, # array
        )

        result['success'] = True
        result['post_id'] = post.post_id
        result['new_user'] = created

        # Debug/Logging
        event_type = 'http_request'
        event_details = {
            'url':'publishpost.json',
            'event_datetime': str(datetime.datetime.now()),
            'client_id': client_id,
            'assignment_id': assignment_id,
            'language_code': language_code,
            'location': location,
            'media_objects': media_objects,
            'success': result['success'],
            'post_id': result['post_id'],
            'new_user': result['new_user'],
        }
        clientlog = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

        if created:
            #datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
            event_type = 'new_user_created'
            event_details = {
                'client_id': client_id,
                'method': 'publish_post.json',
            }
            clientlog = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    #except:
    #   pass

    #resp = json.dumps(result)
    #return Response(resp,content_type='application/json') 

    return make_response(result)

@view_config(route_name='upload_media.json')
def upload_media(request):

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
        client_id = request.POST['client_id']
        media_type = request.POST['media_type']

        media_file_name = ''
        try:

            media_file_name = request.POST['media_file'].filename
            input_file = request.POST['media_file'].file

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
            media_text = request.POST['media_text']
        except:
            pass


        # register file with database, and get file id back
        media_object, created = MediaObjects.create_new_media_object(
            DBSession,
            client_id,
            media_type,
            media_file_name,
            media_caption,
            media_text,
        )

        result['media_id'] = media_object.unique_id
        result['success'] = True
        result['new_user'] = created
        
        # Debug/Logging
        #datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
        event_type = 'http_request'
        event_details = {
            'url':'uploadmedia.json',
            'event_datetime': str(datetime.datetime.now()),
            'client_id': client_id,
            'media_type': media_type,
            'file_name': media_file_name,
            'media_caption': media_caption,
            'media_text': media_text,
            'success': result['success'],
            'media_id': result['media_id'],
            'new_user': result['new_user'],
        }
        clientlog = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

        if created:
            #datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
            event_type = 'new_user_created'
            event_details = {
                'client_id': client_id,
                'method': 'upload_media.json',
            }
            clientlog = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    #except:
    #    pass


    #resp = json.dumps(result)
    #return Response(resp,content_type='application/json')

    return make_response(result)


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

