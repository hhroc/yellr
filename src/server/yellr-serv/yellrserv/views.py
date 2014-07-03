import os
import json
from time import strftime
import uuid

from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .mediahelper import registermedia

from .models import (
    DBSession,
    #MyModel,
    UserTypes,
    Users,
    Assignments,
    Questions,
    QuestionAssignments,
    Languages,
    Posts,
    MediaTypes,
    Mediaobjects,
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
    <form action="/uploadtest.json" method="post" accept-charset="utf-8" enctype="multipart/form-data">
        <input id="sometext" name="sometext" type="text" value="This is a test!">
        <input type="submit" value="submit" />
    </form>

    </html>
    """.format(uuid.uuid4())

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

@view_config(route_name='uploadmedia.json')
def uploadmedia(request):

    """
    HTTP POST with the following fields:

    mediafile, type: file
    clientid, type: text
    mediatype, type: text
        where valid mediatypes are: 'text', 'audio', 'video', 'image'

    """

    print "Servicing request."

    result = {'success': False}

    try:
    #if True:

        # get the file name
        filename = request.POST['mediafile'].filename

        # get the clientid that the upload will be associated with
        clientid = request.POST['clientid']

        # get the media type we are working with
        mediatype = request.POST['mediatype']

        # decode media type
        if mediatype == 'image':
            mediaext  = 'jpg'
        elif mediatype == 'video':
            mediaext = 'mpg'
        elif mediatype == 'audio':
            mediaext = 'mp3'
        elif mediatype == 'text':
            mediaext = 'txt'
        else:
            raise Exception('invalid media type')

        # get the file contents
        inputfile = request.POST['mediafile'].file

        # generate a unique file name to store the file to
        fname = '{0}.{1}'.format(uuid.uuid4(),mediaext)
        filepath = os.path.join(system_config['upload_dir'], fname)

        # write file to temp location, and then to disk
        tempfilepath = filepath + '~'
        outputfile = open(tempfilepath, 'wb')

        # Finally write the data to disk
        inputfile.seek(0)
        while True:
            data = inputfile.read(2<<16)
            if not data:
                break
            outputfile.write(data)

        # rename once we are valid
        os.rename(tempfilepath, filepath)

        # register file with database, and get file id back
        mediaid = registermedia(filepath)

        result['mediaid'] = mediaid
        result['success'] = True

    except:
        pass

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

