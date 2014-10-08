import os
import json
from time import strftime
import uuid
import datetime
import subprocess
import magic
import mutagen.mp3
import mutagen.oggvorbis
import mutagen.mp4

from utils import make_response

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
    Stories,
    EventLogs,
    Collections,
    CollectionPosts,
    Messages,
    Notifications,
    )

from config import system_config

SERVER_VERSION = '0.0.1'
REQUIRED_CLIENT_VERSION = '0.0.1'

system_status = {
    'alive': True,
    'launchtime': str(strftime("%Y-%m-%d %H:%M:%S")),
}

@view_config(route_name='index', renderer='templates/index.mak')
def index(request):

    #try:
    if True:

        

        latest_stories,dummy = Stories.get_stories(
            session = DBSession,
            lat = 43.1,
            lng = -77.5,
            language_code = 'en',
        )

        ret_latest_stories = []
        for story_unique_id, publish_datetime, edited_datetime, title, tags, \
                top_text, contents, top_left_lat, top_left_lng, \
                bottom_right_lat, bottom_right_lng, first_name, last_name, \
                organization, email, media_file_name, media_id in latest_stories:
            ret_latest_stories.append({
                'story_unique_id': story_unique_id,
                'publish_datetime': str(publish_datetime),
                'edited_datetime': str(edited_datetime),
                'title': title,
                'tags': tags,
                'top_text': top_text,
                'contents': contents,
                'top_left_lat': top_left_lat,
                'top_left_lng': top_left_lng,
                'bottom_right_lat': bottom_right_lat,
                'bottom_right_lng': bottom_right_lng,
                'author_first_name': first_name,
                'author_last_name': last_name,
                'author_organization': organization,
                'author_email': email,
                'banner_media_file_name': media_file_name,
                'banner_media_id': media_id,
            })

    #except:
    #    pass
    
    return {'stories': True, 'latest_stories': ret_latest_stories}




#@view_config(route_name='index.html')
#def index(request):
#
#    resp = """
#           Welcome to Yellr!<br><br>Head over to the github repo
#           <a href="https://github.com/hhroc/yellr">here</a>.
#           """
#    return Response(resp)

@view_config(route_name='server_info.json')
def get_users(request):

    """ Allows clients to get version information about the server
    """

    result = {'success': False}

    try:
    #if True:

        result['server_version'] = SERVER_VERSION
        result['required_client_version'] = REQUIRED_CLIENT_VERSION
        result['success'] = True

    except:
        pass

    resp = json.dumps(result)
    return Response(resp,content_type='application/json')

@view_config(route_name='get_posts.json')
def get_posts(request):

    """
    Return all of the posts on the server
    """

    result = {'success': False}

    try:
    #if True:

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
            result['error_text'] = "Missing or invalidfield"
            raise Exception('missing/invalid field')

        if user_id != None:
            posts = Posts.get_all_from_user_id(DBSession, user_id, reported)
        else:    
            posts = Posts.get_posts(DBSession, reported)

        ret_posts = []
        for post_id,title,post_datetime,reported,lat,lng,assignment_id, \
                verified,user_client_id,first_name,last_name,organization, \
                language_code,language_name in posts:
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
                'title': title,
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

    except:
        pass

    event_type = 'http_request'
    event_details = {
        'client_id': client_id,
        'method': 'get_posts.json',
        'post_count': len(ret_posts),
        'result': result,
    }
    client_log = EventLogs.log(DBSession,client_id,event_type, \
        json.dumps(event_details))

    resp = json.dumps(result)
    return Response(resp, content_type='application/json')

@view_config(route_name='get_assignments.json')
def get_assignments(request):

    result = {'success': False}

    # defaults for client logs
    client_id = None
    ret_assignments = []

    try:
    #if True:
    
        #language_code = 'en'
        #if True:
        try:
            client_id = request.GET['client_id']
            language_code = request.GET['language_code']
            lat = float(request.GET['lat'])
            lng = float(request.GET['lng'])
        except:
            result['error_text'] = "Missing or invalid field"
            raise Exception('missing/invalid field')

        assignments = Assignments.get_all_open_with_questions(DBSession, \
            language_code, lat, lng)

        ret_assignments = []
        for assignment_id, publish_datetime, expire_datetime, top_left_lat, \
                top_left_lng, bottom_right_lat, bottom_right_lng, use_fence, \
                organization, question_text, question_type_id, description, \
                answer0, answer1, answer2, answer3, answer4, answer5, answer6, \
                answer7, answer8, answer9 in assignments:
            ret_assignments.append({
                'assignment_id': assignment_id,
                'organization': organization,
                'publish_datetime': str(publish_datetime),
                'expire_datetime': str(expire_datetime),
                'top_left_lat': top_left_lat,
                'top_left_lng': top_left_lng,
                'bottom_right_lat': bottom_right_lat,
                'bottom_right_lng': bottom_right_lng,
                'question_text': question_text,
                'question_type_id': question_type_id,
                'description': description,
                'answer0': answer0,
                'answer1': answer1,
                'answer2': answer2,
                'answer3': answer3, 
                'answer4': answer4,
                'answer5': answer5,
                'answer6': answer6, 
                'answer7': answer7, 
                'answer8': answer8,
                'answer9': answer9,
            })

        result['assignments'] = ret_assignments
        result['success'] = True
    
    except:
        pass

    event_type = 'http_request'
    event_details = {
        'client_id': client_id,
        'method': 'get_assignments.json',
        'message_count': len(ret_assignments),
        'result': result,
    }
    client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    return make_response(result)

@view_config(route_name='get_notifications.json')
def get_notifications(request):

    result = {'success': False}

    try:

        client_id = None
        try:
            client_id = request.GET['client_id']
        except:
            result['error_text'] = 'Missing or invalid field'
            raise Exception("missing/invalid field")

        if client_id != None:
            notifications,created = Notifications.get_notifications_from_client_id(
                DBSession,
                client_id
            )
            ret_notifications = []
            for notification_id, notification_datetime, \
                    notification_type, payload in notifications:
                ret_notifications.append({
                    'notification_id': notification_id,
                    'notification_datetime': str(notification_datetime),
                    'notification_type': notification_type,
                    'payload': json.loads(payload),
                })

            result['notifications'] = ret_notifications
            result['success'] = True

    except Exception, e:
        pass

    event_type = 'http_request'
    event_details = {
        'client_id': client_id,
        'method': 'get_notifications.json',
        'message_count': len(ret_notifications),
        'result': result,
    }
    client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    return make_response(result)

@view_config(route_name='create_response_message.json')
def create_response_message(request):

    result = {'success': False}

    try:
    #if True:

        try:
        #if True:
            client_id = request.POST['client_id']
            parent_message_id = request.POST['parent_message_id']
            subject = request.POST['subject']
            text = request.POST['text']
        except:
            result['error_text'] = 'Missing or invalid field'
#            result['error_text'] = """\
#One or more of the following fields is missing or invalid: client_id, \
#parent_message_id, subject, text.\
#"""
            raise Exception("missing/invalid field")

        message = Messages.create_response_message_from_http(
            session = DBSession,
            client_id = client_id,
            parent_message_id = parent_message_id,
            subject = subject,
            text = text,
        )

        if message != None:
            result['message_id'] = message.message_id
            result['success'] = True
        else:
            result['error_text'] = "Message already has posted response."

    except:
        pass

    return make_response(result)

@view_config(route_name='get_messages.json')
def get_messages(request):

    result = {'success': False}

#    try:

    if True:

        client_id = None
        try:
            client_id = request.GET['client_id']
        except:
            result['error_text'] = "Missing or invalid field."
            raise Exception("missing/invalid field")

        messages = Messages.get_messages_from_client_id(DBSession, client_id)
        ret_messages = []
        for message_id, from_user_id,to_user_id,message_datetime, \
                parent_message_id,subject,text, was_read,from_organization, \
                from_first_name,from_last_name in messages:
            ret_messages.append({
                'message_id': message_id,
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

    event_type = 'http_request'
    event_details = {
        'client_id': client_id,
        'method': 'get_messages.json',
        'message_count': len(ret_messages),
        'result': result,
    }
    client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    return make_response(result)

@view_config(route_name='get_stories.json')
def get_stories(request):

    result = {'success': False}

    #try:
    if True:

        client_id = None
        if True:
        #try:
            client_id = request.GET['client_id']
            lat = float(request.GET['lat'])
            lng = float(request.GET['lng'])
            language_code = request.GET['language_code']
        #except:
        #    result['error_text'] = "Missing or invalid field."
        #    raise Exception("missing/invalid field")

        start = 0
        try:
            start = request.GET['start']
        except:
            pass

        count = 0
        try:
            count = request.GET['start']
        except:
            pass

        stories, total_story_count = Stories.get_stories(
            session = DBSession,
            lat = lat,
            lng = lng,
            language_code = language_code,
            start = start,
            count = count,
        )

        ret_stories = []
        for story_unique_id, publish_datetime, edited_datetime, title, tags, \
                top_text, contents, top_left_lat, top_left_lng, \
                bottom_right_lat, bottom_right_lng, first_name, last_name, \
                organization, email, media_file_name, media_id in stories:
            ret_stories.append({
                'story_unique_id': story_unique_id,
                'publish_datetime': str(publish_datetime),
                'edited_datetime': str(edited_datetime),
                'title': title,
                'tags': tags,
                'top_text': top_text,
                'contents': contents,
                'top_left_lat': top_left_lat,
                'top_left_lng': top_left_lng,
                'bottom_right_lat': bottom_right_lat,
                'bottom_right_lng': bottom_right_lng,
                'author_first_name': first_name,
                'author_last_name': last_name,
                'author_organization': organization,
                'author_email': email,
                'banner_media_file_name': media_file_name,
                'banner_media_id': media_id,
            })

        result['total_story_count'] = total_story_count
        result['stories'] = ret_stories
        result['success'] = True

    #except:
    #    pass

    event_type = 'http_request'
    event_details = {
        'client_id': client_id,
        'method': 'get_stories.json',
        'message_count': len(ret_stories),
        'result': result,
    }
    client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    return make_response(result)


@view_config(route_name='publish_post.json')
def publish_post(request):

    """
    HTTP POST with the following fields:

    client_id, type: text (unique client id)
    assignment_id, type: text ( '' for no assignment)
    language_code, type: text (two letter language code)
    lat, type: text (latitude in degrees)
    lng, type: text (longitude in degrees)
    media_objects, type: text (json array of media id's)

    """

    result = {'success': False}

    if True:
    #try:

        if True:
        #try:
            client_id = request.POST['client_id']
            assignment_id = request.POST['assignment_id']
            title = request.POST['title']
            language_code = request.POST['language_code']
            lat = request.POST['lat']
            lng = request.POST['lng']
            media_objects = json.loads(urllib.unquote(
                request.POST['media_objects']).decode('utf8')
            )
        #except:
        #    result['error_text'] = 'Missing or invalid field'
        #    raise Exception('missing/invalid field')

        post,created = Posts.create_from_http(
            session = DBSession,
            client_id = client_id,
            assignment_id = assignment_id,
            title = title,
            language_code = language_code,
            lat = lat,
            lng = lng,
            media_objects = media_objects, # array
        )

        result['success'] = True
        result['post_id'] = post.post_id
        result['new_user'] = created

        # Debug/Logging
        event_type = 'http_request'
        event_details = {
            'url':'publish_post.json',
            'event_datetime': str(datetime.datetime.now()),
            'client_id': client_id,
            'assignment_id': assignment_id,
            'language_code': language_code,
            'lat': lat,
            'lng': lng,
            'media_objects': media_objects,
            'success': result['success'],
            'post_id': result['post_id'],
            'new_user': result['new_user'],
        }
        client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

        if created:
            #datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
            event_type = 'new_user_created'
            event_details = {
                'client_id': client_id,
                'method': 'publish_post.json',
            }
            client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

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

    #error_text = ''
    try:
    #if True:

        #if True:
        try:
            client_id = request.POST['client_id']
            media_type = request.POST['media_type']
        except:
            result['error_text'] = 'Missing or invalid field'
            raise Exception('missing fields')

        file_name = ''
        if media_type == 'image' or media_type == 'video' \
                or media_type == 'audio':

    
            if True:
            #try:
                print "FILE TYPE: {0}".format(type(request.POST['media_file']))
                print "FILE CONTENTS: {0}".format(request.POST['media_file'])
                print "LIST OF FORM OBJECTS:"
                print request.POST
                #media_file_name = request.POST['media_file'].filename
                media_file_name = request.POST['file'].filename
                #input_file = request.POST['media_file'].file
                input_file = request.POST['file'].file
            #except:
            #    result['error_text'] = 'Missing or invalid file field'
            #    raise Exception('Invalid media_file field.')
        
            media_extention="processing"

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

            #decode media type of written file
            #more file types can be added, but these should cover most for now
            #TODO: client side validation so they don't lose content when they upload incorrect files?
            #TODO: better error messages
            #TODO: delete / handle (in some way) files that do not validate?
            mimetype = magic.from_file(temp_file_path, mime=True)
            #process image files
            if media_type == 'image':

                #jpeg
                if mimetype == "image/jpeg":
                    media_extention  = 'jpg'
                    print "media_Extension is: " + media_extention

                #png
                elif mimetype == "image/png":
                    media_extention  = 'png'
                    print "media_Extension is: " + media_extention

                #not jpeg or png 
                else:
                    error_text = 'invalid image file'
                    raise Exception('')

                #strip metadata from images with ImageMagick's mogrify
                #TODO: dynamically find mogrify (but I think it's usually /usr/bin)
                if True:
                #try:
                    subprocess.call(['/usr/bin/mogrify', '-strip', temp_file_path])
                #except:
                #    error_text = "Mogrify is missing, or in an unexpected place."
                #    raise Exception('')

            #process video files
            elif media_type == 'video':
                #I can't seem to find any evidence of PII in mpg metadata
                if mimetype == "video/mpeg":
                    media_extention = 'mpg'
                elif mimetype == "video/mp4":
                    media_extension = "mp4"
                    #strip metadata
                    try:
                        mp4 = mutagen.mp4.MP4(temp_file_path)
                        mp4.delete()
                        mp4.save()
                    except:
                        error_text = "Something went wrong while stripping metadata from mp4"
                        raise Exception('')

                else:
                    error_text = 'invalid video file'
                    raise Exception('')

            #process audio files
            elif media_type == 'audio':

                #mp3 file
                if mimetype == "audio/mpeg":
                    media_extention = 'mp3'
                    #strip metadata
                    try:
                        mp3 = mutagen.mp3.MP3(temp_file_path)
                        mp3.delete()
                        mp3.save()
                    except:
                        error_text = "Something went wrong while stripping metadata from mp3"
                        raise Exception('')

                #ogg vorbis file
                elif mimetype == "audio/ogg" or mimetype == "application/ogg":
                    media_extention = 'ogg'
                    try:
                        ogg = mutagen.oggvorbis.Open(temp_file_path)
                        ogg.delete()
                        ogg.save()
                    except:
                        error_text = "Something went wrong while stripping metadata from ogg vorbis"
                        raise Exception('')

                #not mp3 or ogg vorbis
                else:
                    error_text = 'invalid audio file'
                    raise Exception('')

            #I don't think the user has a way to upload files of this type besides typing in the box
            #so it doesn't need as robust detection.
            elif media_type == 'text':
                media_extention = 'txt'

            else:
                error_text = 'invalid media type'
                raise Exception('')

            #the file has been validated and processed, so we adjust the file path
            #to the mimetype-dictated file extension
            file_path = file_path.replace("processing", media_extention)

            # rename once we are valid
            os.rename(temp_file_path, file_path)

            result['file_name'] = file_name

        #except:
            #result['error_text'] = 'Missing or invalid media_file contents.'
            #raise Exception('missing/invalid media_file contents')

        media_caption = ''
        #if True:
        try:
            media_caption = request.POST['caption']
        except:
            pass

        
        media_text = ''
        if media_type == 'text':
            try:
                media_text = request.POST['media_text']
            except:
                raise Exception('Invalid/missing field')

        # register file with database, and get file id back
        media_object, created = MediaObjects.create_new_media_object(
            DBSession,
            client_id,
            media_type,
            file_name,
            media_caption,
            media_text,
        )

        result['media_id'] = media_object.media_id
        result['success'] = True
        result['new_user'] = created
        #result['media_text'] = media_text
        result['error_text'] = '' 

        # Debug/Logging
        #datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
        event_type = 'http_request'
        event_details = {
            'url':'upload_media.json',
            'event_datetime': str(datetime.datetime.now()),
            'client_id': client_id,
            'media_type': media_type,
            'file_name': file_name,
            'media_caption': media_caption,
            'media_text': media_text,
            'success': result['success'],
            'media_id': result['media_id'],
            'new_user': result['new_user'],
            'error_text': result['error_text'],
        }
        client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

        if created:
            #datetime = str(strftime("%Y-%m-%d %H:%M:%S"))
            event_type = 'new_user_created'
            event_details = {
                'client_id': client_id,
                'method': 'upload_media.json',
            }
            client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    except:
        pass


    #resp = json.dumps(result)
    #return Response(resp,content_type='application/json')

    return make_response(result)

@view_config(route_name='get_profile.json')
def get_profile(request):

    result = {'success': False}

#    try:

    if True:

        client_id = None
        try:
            client_id = request.GET['client_id']
        except:
            result['error_text'] = "Missing or invalid field."
            raise Exception("missing/invalid field")

        user,created = Users.get_from_client_id(
            session = DBSession,
            client_id = client_id,
        )

        posts,post_count = Posts.get_all_from_client_id(
            session = DBSession,
            client_id = client_id,
            start = 0,
            count = 5, # only return the last 5 posts
        )

        ret_posts = {}
        for post_id, assignment_id, user_id, title, post_datetime, reported, \
                lat, lng, media_object_id, media_id, file_name, caption, \
                media_text, media_type_name, media_type_description, \
                verified, client_id, language_code, language_name in posts:
            if post_id in ret_posts:
                ret_posts[post_id]['media_objects'].append({
                    'media_id': media_id,
                    'file_name': file_name,
                    'caption': caption,
                    'media_text': media_text,
                    'media_type_name': media_type_name,
                    'media_type_description': media_type_description,
                })
            else:
                ret_posts[post_id] = {
                    'post_id': post_id,
                    'assignment_id': assignment_id,
                    'user_id': user_id,
                    'title': title,
                    'post_datetime': str(post_datetime),
                    'reported': reported,
                    'lat': lat,
                    'lng': lng,
                    'verified_user': bool(verified),
                    'client_id': client_id,
                    'language_code': language_code,
                    'language_name': language_name,
                    'media_objects': [{
                        'media_id': media_id,
                        'file_name': file_name,
                        'caption': caption,
                        'media_text': media_text,
                        'media_type_name': media_type_name,
                        'media_type_description': media_type_description,
                    }],
                }
 
        result['posts'] = ret_posts
        result['post_count'] = post_count
        result['first_name'] = user.first_name
        result['last_name'] = user.last_name
        result['organization'] = user.organization
        result['email'] = user.email
        result['verified']  = user.verified
        result['success'] = True

#    except:
#        pass

    event_type = 'http_request'
    event_details = {
        'client_id': client_id,
        'method': 'get_profile.json',
        #'post_count': len(ret_messages),
        'result': result,
    }
    client_log = EventLogs.log(DBSession,client_id,event_type,json.dumps(event_details))

    return make_response(result)

