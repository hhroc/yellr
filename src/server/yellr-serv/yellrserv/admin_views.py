import os
import json
from time import strftime
import uuid
import datetime

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
    QuestionTypes,
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
    Subscribers,
    )

def check_token(request):
    """ validates token against database """
    valid = False
    user = None
    try:
        token = request.GET['token']
        valid, user = Users.validate_token(DBSession, token)
    except:
        pass
    return valid, user

@view_config(route_name='admin/get_access_token.json')
def admin_get_access_token(request):

    result = {'success': False}

    try:
    #if True:

        try:
            user_name = request.GET['user_name']
            password = request.GET['password']
        except:
            result['error_text'] = "Missing 'user_name' or 'password' within request"
            raise Exception('missing credentials')

        print "working on u: '{0}', p: '{1}'".format(user_name, password)

        user, token = Users.authenticate(DBSession, user_name, password)

        if token == None:
            result['error_text'] = 'Invalid credentials'
            raise Exception('invalid credentials')
        else:
            result['token'] = token
            result['first_name'] = user.first_name
            result['last_name'] = user.last_name
            result['organization'] = user.organization
            result['success'] = True

    except Exception, e:
        pass

    return make_response(result)

@view_config(route_name='admin/get_client_logs.json')
def admin_get_client_logs(request):

    """
    Returns all of the event logs in the system.  Optionally by client_id.
    """

    result = {'succes' :False}

    try:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        client_id = None
        try:
            client_id = request.GET['client_id']
        except:
            pass

        logs = EventLogs.get_all(DBSession)

        ret_logs = []
        for log in logs:
            ret_logs.append({
                'event_log_id': log.event_log_id,
                'user_id': log.user_id,
                'event_type': log.event_type,
                'event_datetime': str(log.event_datetime),
                'details': json.loads(log.details),
            })

        result['logs'] = ret_logs
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/get_posts.json')
def admin_get_posts(request):

    """ Will return current posts from database """

    result = {'success': False}

    # try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        start = 0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count = 0
        try:
            count = int(request.GET['count'])
        except:
            pass

        reported = False
        try:
             reported = bool(int(request.GET['reported']))
        except:
            pass

        posts, total_post_count = Posts.get_posts(
            DBSession,
            reported = reported,
            start = start,
            count = count,
        )

        print "\n\n"
        print total_post_count
        print "\n\n"
        print posts
        print "\n\n"
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


        result['total_post_count'] = total_post_count
        result['posts'] = ret_posts

        result['success'] = True

    # except:
        # pass

    return make_response(result)

@view_config(route_name='admin/create_question.json')
def admin_create_question(request):

    result = {'success': False}

    #if True:
    try:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        print ""
        print request.POST
        print ""

        #if True:
        try:
            language_code = request.POST['language_code']
            question_text = request.POST['question_text']
            description = request.POST['description']
            question_type = request.POST['question_type']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: language_code, \
question_text, description, question_type. \
"""
            raise Exception('missing field')


        # answers is a json array of strings
        answers = []
        try:
        #if True:
            answers = json.loads(request.POST['answers'])
        except:
            pass
        # back fill with empty strings
        for i in range(len(answers),10):
            answers.append('')

        question = Questions.create_from_http(
            session = DBSession,
            token = user.token,
            language_code = language_code,
            question_text = question_text,
            description = description,
            question_type = question_type,
            answers = answers,
        )

        result['question_id'] = question.question_id
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/update_question.json')
def admin_update_question(request):

    result = {'success': False}

    #if True:
    try:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        #if True:
        try:
            language_code = request.POST['language_code']
            question_text = request.POST['question_text']
            description = request.POST['description']
            question_type = request.POST['question_type']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: language_code, \
question_text, description, question_type. \
"""
            raise Exception('missing field')

        # answers is a json array of strings
        answers = []
        try:
        #if True:
            answers = json.loads(request.POST['answers'])
        except:
            pass
        # back fill with empty strings
        for i in range(len(answers),10):
            answers.append('')

        question = Questions.update_from_http(
            session = DBSession,
            token = user.token,
            language_code = language_code,
            question_text = question_text,
            description = description,
            question_type = question_type,
            answers = answers,
        )

        result['question_id'] = question.question_id
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/publish_assignment.json')
def admin_publish_assignment(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        #if True:
        try:
            #client_id = request.POST['client_id']
            life_time = int(request.POST['life_time'])
            questions = json.loads(request.POST['questions'])
            top_left_lat = float(request.POST['top_left_lat'])
            top_left_lng = float(request.POST['top_left_lng'])
            bottom_right_lat = float(request.POST['bottom_right_lat'])
            bottom_right_lng = float(request.POST['bottom_right_lng'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: life_time,\
questions (JSON list of question id's), top_left_lat, top_left_lng, \
bottom_right_lat, bottom_right_lng.
"""
            raise Exception('invalid/missing field')

        #geo_fence = {
        #    'top_left_lat': top_left_lat,
        #    'top_left_lng': top_left_lng,
        #    'bottom_right_lat': bottom_right_lat,
        #    'bottom_right_lng': bottom_right_lng,
        #}

        # create assignment
        assignment = Assignments.create_from_http(
            session = DBSession,
            token = user.token,
            life_time = life_time,
            #geo_fence = geo_fence,
            top_left_lat = top_left_lat,
            top_left_lng = top_left_lng,
            bottom_right_lat = bottom_right_lat,
            bottom_right_lng = bottom_right_lng,
        )

        # assign question to assignment
        for question_id in questions:
            QuestionAssignments.create(
                DBSession,
                assignment.assignment_id,
                question_id,
            )

        result['assignment_id'] = assignment.assignment_id

        result['success'] = True

    except:
        pass


    return make_response(result)

@view_config(route_name='admin/update_assignment.json')
def admin_update_assignment(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        #if True:
        try:
            assignment_id = request.POST['assignment_id']
            #client_id = request.POST['client_id']
            life_time = int(request.POST['life_time'])
            #questions = json.loads(request.POST['questions'])
            top_left_lat = float(request.POST['top_left_lat'])
            top_left_lng = float(request.POST['top_left_lng'])
            bottom_right_lat = float(request.POST['bottom_right_lat'])
            bottom_right_lng = float(request.POST['bottom_right_lng'])
            #use_fence = boolean(request.POST['use_fence'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: life_time, \
top_left_lat, top_left_lng, bottom_right_lat, bottom_right_lng. \
"""
            raise Exception('invalid/missing field')

        # create assignment
        assignment = Assignments.update_assignment(
            session = DBSession,
            assignment_id = assignment_id,
            life_time = life_time,
            top_left_lat = top_left_lat,
            top_left_lng = top_left_lng,
            bottom_right_lat = bottom_right_lat,
            bottom_right_lng = bottom_right_lng,
            #use_fence = use_fence,
        )

        result['assignment_id'] = assignment.assignment_id
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/get_my_assignments.json')
def admin_get_my_assignments(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

#        try:
#            assignment_id = int(request.GET['assignment_id'])
#        except:
#            result['error_text'] = """\
#One or more of the following fields is missing or invalid: assignment_id. \
#"""
#            raise Exception('invalid/missing field')

        start=0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count=0
        try:
            count = int(request.GET['count'])
        except:
            pass

        assignments,assignment_count = Assignments.get_all_with_questions_from_token(
            session = DBSession,
            token = user.token,
            start = start,
            count = count,
        )

        index = 0
        ret_assignments = {}
        for assignment_id, publish_datetime, expire_datetime, \
                top_left_lat, top_left_lng, bottom_right_lat, \
                bottom_right_lng, use_fence, organization, question_text, \
                question_type_id, answer0, answer1, answer2, answer3, \
                answer4, answer5, answer6, answer7, answer8, \
                answer9 in assignments:
            if assignment_id in ret_assignments:
                ret_assignments[assignment_id]['questions'].append({
                    'question_text': question_text,
                    'question_type_id': question_type_id,
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
            else:
                ret_assignments[assignment_id] = {
                    'assignment_id': assignment_id,
                    'publish_datetime': str(publish_datetime),
                    'expire_datetime': str(expire_datetime),
                    'top_left_lat': top_left_lat,
                    'top_left_lng': top_left_lng,
                    'bottom_right_lat': bottom_right_lat,
                    'bottom_right_lng': bottom_right_lng,
                    #'use_fence': use_fence,
                    #'organization': organization,
                    'questions': [{
                        'question_text': question_text,
                        'question_type_id': question_type_id,
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
                    }],
                }

        result['assignment_count'] = assignment_count
        result['assignments'] = ret_assignments
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/create_message.json')
def admin_create_message(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
            to_client_id = request.POST['to_client_id']
            subject = request.POST['subject']
            text = request.POST['text']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: to_client_id, \
subject, text.
"""
            raise Exception('invalid/missing field')

        parent_message_id = None
        try:
            parent_message_id = request.POST['parent_message_id']
        except:
            pass

        message = Messages.create_message_from_http(
            session = DBSession,
            from_token = user.token,
            to_client_id = to_client_id,
            subject = subject,
            text = text,
            parent_message_id = parent_message_id,
        )

        if message != None:
            result['message_id'] = message.message_id
            result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/get_my_messages.json')
def admin_get_my_messages(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

#        try:
#            to_client_id = request.POST['to_client_id']
#            subject = request.POST['subject']
#            text = request.POST['text']
#        except:
#            result['error_text'] = """\
#One or more of the following fields is missing or invalid: to_client_id, \
#subject, text.
#"""
#            raise Exception('invalid/missing field')

#        parent_message_id = None
#        try:
#            parent_message_id = request.POST['parent_message_id']
#        except:
#            pass


        user = Users.get_from_token(DBSession, token)
        messages = Messages.get_messages_from_client_id(
            DBSession,
            user.client_id,
        )
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

    except:
        pass

    return make_response(result)


@view_config(route_name='admin/get_languages.json')
def admin_get_languages(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        languages = Languages.get_all(DBSession)

        ret_languages = []
        for language_code, name in languages:
            ret_languages.append({
                'name': name,
                'code': language_code,
            })

        result['languages'] = ret_languages
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/get_question_types.json')
def admin_get_question_types(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        question_types = QuestionTypes.get_all(DBSession)

        ret_question_types = []
        for question_type_id, question_type_text, question_type_description \
                in question_types:
            ret_question_types.append({
                'question_type_id': question_type_id,
                'question_type_text': question_type_text,
                'question_type_description': question_type_description,
            })

        result['question_types'] = ret_question_types
        result['success'] = True

    except:
        pass

    return make_response(result)


@view_config(route_name='admin/create_user.json')
def admin_create_user(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
            user_type_text = request.POST['user_type']
            user_name = request.POST['user_name']
            password = request.POST['password']
            first_name = request.POST['first_name']
            last_name = request.POST['last_name']
            email = request.POST['email']
            organization = request.POST['organization']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: user_type, \
user_name, password, first_name, last_name, email, organization. \
"""
            raise Exception('invalid/missing field')

        user_type = UserTypes.get_from_name(DBSession, user_type_text)
        user = Users.create_new_user(
            session = DBSession,
            user_type_id = user_type.user_type_id,
            client_id = str(uuid.uuid4()),
        )

        user = Users.verify_user(
            session = DBSession,
            client_id = user.client_id,
            user_name = user_name,
            password = password,
            first_name = first_name,
            last_name = last_name,
            email = email,
        )

        result['user_id'] = user.user_id
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/get_assignment_responses.json')
def admin_get_assignment_responses(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
            assignment_id = int(request.GET['assignment_id'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: assignment_id. \
"""
            raise Exception('invalid/missing field')

        start=0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count=0
        try:
            count = int(request.GET['count'])
        except:
            pass

        posts,post_count = Posts.get_all_from_assignment_id(
            session = DBSession,
            assignment_id = assignment_id,
            start = start,
            count = count,
        )

        index = 0
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

        result['post_count'] = post_count
        result['posts'] = ret_posts
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/register_post_view.json')
def admin_register_post_view(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
            post_id = request.POST['post_id']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: post_id. \
"""
            raise Exception('invalid/missing field')

        post = Posts.get_from_post_id(
            session = DBSession,
            post_id = post_id,
        )

        notification = Notifications.create_notification(
            session = DBSession,
            user_id = post.user_id,
            notification_type = 'post_viewed',
            payload = json.dumps({
                'organization': user.organization,
            })
        )

        result['post_id'] = post_id
        result['notification_id'] = notification.notification_id
        result['success'] = True

    #except:
    #    pass

    return make_response(result)


@view_config(route_name='admin/publish_story.json')
def admin_publish_story(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
            title = request.POST['title']
            tags = request.POST['tags']
            top_text = request.POST['top_text']
            banner_media_id = request.POST['banner_media_id']
            contents = request.POST['contents']
            top_left_lat = float(request.POST['top_left_lat'])
            top_left_lng = float(request.POST['top_left_lng'])
            bottom_right_lat = float(request.POST['bottom_right_lat'])
            bottom_right_lng = float(request.POST['bottom_right_lng'])
            language_code = request.POST['language_code']
            #use_fense = request.POST['use_fense']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: title, tags, \
top_text, banner_media_id, contents, top_left_lat, top_left_lng, \
bottom_right_lat, bottom_right_lng, language_code. \
"""
            raise Exception('invalid/missing field')

        story = Stories.create_from_http(
            session = DBSession,
            token = user.token,
            title = title,
            tags = tags,
            top_text = top_text,
            media_id = banner_media_id,
            contents = contents,
            top_left_lat = top_left_lat,
            top_left_lng = top_left_lng,
            bottom_right_lat = bottom_right_lat,
            bottom_right_lng = bottom_right_lng,
            #use_fence = use_fense,
            language_code = language_code,
        )

        result['story_unique_id'] = story.story_unique_id
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/get_my_collections.json')
def admin_get_my_collection(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

#        try:
#        #if True:
#            name = request.POST['name']
#            description = request.POST['description']
#            tags = request.POST['tags']
#        except:
#            result['error_text'] = """\
#One or more of the following fields is missing or invalid: name, \
#description, tags. \
#"""
#            raise Exception('Missing or invalid field.')

        collections = Collections.get_all_from_http(
           session = DBSession,
           token = user.token,
        )

        ret_collections = []
        for collection_id, user_id, collection_datetime, name, description, \
                tags, enabled in collections:
            ret_collections.append({
                'collection_id': collection_id,
                'collection_datetime': str(collection_datetime),
                'name': name,
                'decription': description,
                'tags': tags,
                'enabled': enabled,
            })

        result['collections'] = ret_collections
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/create_collection.json')
def admin_create_collection(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
        #if True:
            name = request.POST['name']
            description = request.POST['description']
            tags = request.POST['tags']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: name, \
description, tags. \
"""
            raise Exception('Missing or invalid field.')

        collection = Collections.create_new_collection_from_http(
            session = DBSession,
            token = user.token,
            name = name,
            description = description,
            tags = tags,
        )

        result['collection_id'] = collection.collection_id
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/add_post_to_collection.json')
def admin_add_post_to_collection(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
        #if True:
            collection_id = int(request.POST['collection_id'])
            post_id = int(request.POST['post_id'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: collection_id, \
post_id. \
"""
            raise Exception('Missing or invalid field.')

        collection = Collections.add_post_to_collection(
            session = DBSession,
            collection_id = collection_id,
            post_id = post_id,
        )

        result['post_id'] = post_id
        result['collection_id'] = collection_id
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/remove_post_from_collection.json')
def admin_remove_post_from_collection(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
        #if True:
            collection_id = int(request.POST['collection_id'])
            post_id = int(request.POST['post_id'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: collection_id, \
post_id. \
"""
            raise Exception('Missing or invalid field.')

        successfully_removed = Collections.remove_post_from_collection(
            session = DBSession,
            collection_id = collection_id,
            post_id = post_id,
        )
        if successfully_removed:
            result['post_id'] = post_id
            result['collection_id'] = collection_id
            result['success'] = True
        else:
            result['error_text'] = 'Post does not exist within collection.'

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/disable_collection.json')
def admin_disable_collection(request):

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
        #if True:
            collection_id = int(request.POST['collection_id'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: collection_id. \
"""
            raise Exception('Missing or invalid field.')

        collection = Collections.disable_collection(
            session = DBSession,
            collection_id = collection_id,
        )

        result['collection_id'] = collection.collection_id
        result['disabled'] = True
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/get_collection_posts.json')
def admin_get_collection_posts(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
            collection_id = int(request.GET['collection_id'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: collection_id. \
"""
            raise Exception('invalid/missing field')

        start=0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count=0
        try:
            count = int(request.GET['count'])
        except:
            pass

        posts,post_count = Posts.get_all_from_collection_id(
            session = DBSession,
            collection_id = collection_id,
            start = start,
            count = count,
        )
        collection = Collections.get_from_collection_id(
            session = DBSession,
            collection_id = collection_id,
        )

        index = 0
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

        result['post_count'] = post_count
        result['collection_id'] = collection.collection_id
        result['collection_name'] = collection.name
        result['posts'] = ret_posts
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/get_user_posts.json')
def admin_get_user_posts(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        try:
        #if True:
            client_id = request.GET['client_id']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: client_id. \
"""
            raise Exception('Missing or invalid field.')

        start=0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count=0
        try:
            count = int(request.GET['count'])
        except:
            pass

        posts,post_count = Posts.get_all_from_client_id(
            session = DBSession,
            client_id = client_id,
            start = start,
            count = count,
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

        result['post_count'] = post_count
        result['posts'] = ret_posts
        result['client_id'] = client_id
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/get_subscriber_list.json')
def admin_get_subscriber_list(request):

    result = {'success': False}

    #try:
    if True:

        token = None
        valid_token = False
        valid, user = check_token(request)
        if valid == False:
            result['error_text'] = "Missing or invalid 'token' field in request."
            raise Exception('invalid/missing token')

        subscribers = Subscribers.get_all_subscribers(
            session = DBSession,
        )

        print subscribers
  
        ret_subscribers = []
        for email,subscribe_datetime,name,organization, \
                profession,receive_updates,receive_version_announcement, \
                interested_in_partnering,want_to_know_more in subscribers:
            ret_subscribers.append({
                'email': email,
                'subscribe_datetime': str(subscribe_datetime),
                'name': name,
                'organization': organization,
                'profession': profession,
                'receieve_updates': receieve_updates,
                'receieve_version_announcement': receieve_version_announcement,
                'interested_in_partnering': interested_in_partnering,
                'want_to_know_more': want_to_know_more,
            })

        result['subscribers'] = ret_subscribers
        result['disabled'] = True
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

