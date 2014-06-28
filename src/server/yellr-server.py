import os
from time import strftime
import json
import uuid

from wsgiref.simple_server import make_server

from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response

from dbapi import registermedia

system_status = {
    'alive': True,
    'launchtime': str(strftime("%Y-%m-%d %H:%M:%S")),
}

system_config = {
    'upload_dir': './uploads',
}


#
# THIS IS ONLY FOR DEBUG, REMOVE LATER ONE
#

@view_config(route_name='index.html')
def index(request):
    resp = """

    <html>
    <body>
    <form action="/uploadmedia.json" method="post" accept-charset="utf-8" enctype="multipart/form-data">
        <input id="mediafile" name="mediafile" type="file" value="test.txt" />
        <input id="clientid" name="clientid" type="text" value="{0}" />
        <input id="mediatype" name="mediatype" type="mediatype" value="text">
        <input type="submit" value="submit" />
    </form>
    </body>
    </html>
    """.format(uuid.uuid4())

    return Response(resp)

@view_config(route_name='status.json')
def status(request):
    resp = json.dumps(system_status)
    return Response(resp)

#@view_config(route_name='')
#def 

@view_config(route_name='uploadmedia.json')
def uploadmedia(request):

    """
    HTTP POST with the following fields:

    mediafile, type: file
    clientid, type: text
    mediatype, type: text
        where valid mediatypes are: 'text', 'audio', 'video', 'image'

    """

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
    return Response(resp)

def makeapp():

    config = Configurator()

    # status API call
    config.add_route('status.json', '/status.json')
    config.add_view(status, route_name='status.json')

    # upload file 
    config.add_route('uploadmedia.json', '/uploadmedia.json')
    config.add_view(uploadmedia, route_name='uploadmedia.json')

    # index
    config.add_route('index.html', '/')
    config.add_view(index, route_name='index.html')

    app = config.make_wsgi_app()

    return app

if __name__ == '__main__':

    app = makeapp()

    server = make_server('0.0.0.0', 8080, app)
    server.serve_forever()


    
