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

from config import system_config

system_status = {
    'alive': True,
    'launchtime': str(strftime("%Y-%m-%d %H:%M:%S")),
}

def make_response(resp_dict):
    resp = Response(json.dumps(resp_dict), content_type='application/json', charset='utf8')
    resp.headerlist.append(('Access-Control-Allow-Origin', '*'))
    return resp

@view_config(route_name='index.html')
def index(request):

    resp = """
           Welcome to Yellr!<br><br>Head over to the github repo
           <a href="https://github.com/hhroc/yellr">here</a>.
           """
    return Response(resp)

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

@view_config(route_name='get_users.json')
def get_users(request):

    """ This is for debug use only.
    """

    result = {'success': False}

#    try:
    if True:

        users = Users.get_all(DBSession)
        ret_users = []
        for user_id,verified,client_id,first_name,last_name, \
                organization,email,user_type_name,user_type_description in users:
            ret_users.append({
                'user_id': user_id,
                'verified': verified,
                'client_id': client_id,
                'first_name': first_name,
                'last_name': last_name,
                'organization': organization,
                'email': email,
                'user_type': user_type_name,
                'user_type_description': user_type_description,
            })

        result['users'] = ret_users
        result['success'] = True

#    except:
#        pass

    resp = json.dumps(result)
    return Response(resp,content_type='application/json')


@view_config(route_name='get_posts.json')
def get_posts(request):

    """
    Return all of the posts on the server
    """

    result = {'success': False}

    #try:
    if True:

        reported = False
        try:
            reported = bool(request.GET['reported'])
        except:
            pass

        user_id = None
        try:
            client_id = request.GET['client_id']
            user, created = Users.get_from_client_id(
                session = DBSession,
                client_id = client_id,
                create_if_not_exist = False
            )
            user_id = user.user_id
        except:
            pass

        if user_id != None:
            posts = Posts.get_all_from_user_id(DBSession, user_id, reported)
        else:    
            posts = Posts.get_all_posts(DBSession, reported)
            

        ret_posts = []
        for post_id,post_datetime,reported,lat,lng,verified,user_client_id, \
                first_name,last_name,organization,language_code,language_name in posts:
            media_objects = MediaObjects.get_from_post_id(DBSession, post_id)
            ret_media_objects = []
            for file_name,caption,media_text,name,description in media_objects:
                ret_media_objects.append({
                    'file_name': file_name,
                    'caption': caption,
                    'media_text': media_text,
                    'name': name,
                    'description': description,
                })
            ret_posts.append({
                'post_id': post_id,
                'post_datetime': str(post_datetime),
                'reported': reported,
                'lat': lat, 
                'lng': lng,
                'verified': verified,
                'user_id': user_client_id,
                'first_name': first_name,
                'last_name': last_name,
                'organization': organization,
                'language_code': language_code,
                'language_name': language_name,
                'media_objects': ret_media_objects,
            })

        result['posts'] = ret_posts
        result['success'] = True

    #except:
    #    pass

    resp = json.dumps(result)
    return Response(resp, content_type='application/json')

@view_config(route_name='get_messages.json')
def get_messages(request):

    result = {'success': False}

#    try:

    if True:

        client_id = None
        try:
            client_id = request.GET['client_id']
        except:
            pass

        if client_id != None:
            messages = Messages.get_messages_from_client_id(DBSession, client_id)
            ret_messages = []
            for from_user_id,to_user_id,message_datetime,parent_message_id,subject,text, \
                    was_read,from_organization,from_first_name,from_last_name in messages:
                ret_messages.append({
                    'from_user_id': from_user_id,
                    'to_user_id': to_user_id,
                    'from_organization': from_organization,
                    'from_first_name': from_first_name,
                    'from_last_name': from_last_name,
                    'message_datetime': str(message_datetime),
                    'parent_message_id': parent_message_id,
                    'subject': subject,
                    'text': text,
                    'was_read': was_read,
                })

            result['messages'] = ret_messages
            result['success'] = True

#    except:
#        pass

    return make_response(result)

@view_config(route_name='publish_post.json')
def publish_post(request):

    """
    HTTP POST with the following fields:

    client_id, type: text (unique client id)
    assignment_id, type: text ( '' for no assignment)
    language_code, type: text (two letter language code)
    location, type: text (json dict of lat and lng)
    media_objects, type: text (json array of media id's)

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

    media_file, type: file
    client_id, type: text
    media_type, type: text
        where valid mediatypes are: 'text', 'audio', 'video', 'image'

    optional fields:
    
    media_text, type: text
    media_caption, type: text

    """

    result = {'success': False}

    error_text = ''
    #try:
    if True:

        # get required fields
        client_id = request.POST['client_id']
        media_type = request.POST['media_type']

        file_name = ''
        try:

            try:
                media_file_name = request.POST['media_file'].filename
                input_file = request.POST['media_file'].file
            except:
                #raise Exception("Missing or invalid media_file field")
                raise Exception('')

            # decode media type
            if media_type == 'image':
                media_extention  = 'jpg'
            elif media_type == 'video':
                media_extention = 'mpg'
            elif media_type == 'audio':
                media_extention = 'mp3'
            elif media_type == 'text':
                media_extention = 'txt'
            else:
                error_text = 'invalid media type'
                raise Exception('invalid media type')
        
            # generate a unique file name to store the file to
            file_name = '{0}.{1}'.format(uuid.uuid4(),media_extention)
            file_path = os.path.join(system_config['upload_dir'], file_name)

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

            result['file_name'] = file_name

        except Exception, e:
            file_name = ''
            error_text = str(e) 
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
            file_name,
            media_caption,
            media_text,
        )

        result['media_id'] = media_object.unique_id
        result['success'] = True
        result['new_user'] = created
        result['error_text'] = error_text
        result['media_text'] = media_text
        
        # Debug/Logging
        #datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
        event_type = 'http_request'
        event_details = {
            'url':'uploadmedia.json',
            'event_datetime': str(datetime.datetime.now()),
            'client_id': client_id,
            'media_type': media_type,
            'file_name': file_name,
            'media_caption': media_caption,
            'media_text': media_text,
            'success': result['success'],
            'media_id': result['media_id'],
            'new_user': result['new_user'],
            'error_text': error_text,
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

