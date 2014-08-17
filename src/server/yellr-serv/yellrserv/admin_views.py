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
    Notifications,
    )

def check_token(token):
    """ validates token against database """
    valid, user = Users.validate_token(DBSession, token)
    return valid, user


@view_config(route_name='admin/get_access_token.json')
def get_access_token(request):

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

        token = Users.authenticate(DBSession, user_name, password)

        if token == None:
            result['error_text'] = 'Invalid credentials'
            raise Exception('invalid credentials')
        else:
            result['token'] = token

        result['success'] = True

    except Exception, e:
        pass

    return make_response(result)

@view_config(route_name='admin/get_posts.json')
def admin_get_posts(request):

    """ Will return current posts from database """

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        start = 0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count = 50
        try:
            count = int(request.GET['count'])
        except:
            pass

        reported = False
        try:
             reported = bool(int(request.GET['count']))
        except:
            pass

        posts, total_post_count = Posts.get_posts(
            DBSession,
            reported = reported,
            start = start,
            count = count,
        )

        ret_posts = []
        for post_id, title, post_datetime, reported, lat, lng, assignment_id, \
                verified, client_id, first_name, last_name, organization, \
                language_code, language_name in posts:

            media_objects = MediaObjects.get_from_post_id(DBSession, post_id)
            ret_media_objects = []
            for file_name, caption, media_text, media_type, media_description \
                    in media_objects:
                ret_media_objects.append({
                    'file_name': file_name,
                    'caption': caption,
                    'media_text': media_text,
                    'media_type': media_type,
                    'media_description': media_description,
                })
            ret_posts.append({
                'title': title,
                'datetime': str(post_datetime),
                'reported': reported,
                'lat': lat,
                'lng': lng,
                'verified_user': verified, 
                'client_id': client_id,
                'first_name': first_name,
                'last_name': last_name,
                'organization': organization,
                'media_objects': ret_media_objects,
            })

        result['total_post_count'] = total_post_count
        result['posts'] = ret_posts

        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/create_question.json')
def admin_create_question(request):

    result = {'success': False}

    #if True:
    try:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        #if True:
        try:
            language_code = request.POST['language_code']
            question_text = request.POST['question_text']
            question_type = request.POST['question_type']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: language_code, \
question_text, question_type. \
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

        print "\nAnswers:"
        print answers

        question = Questions.create_from_http(
            DBSession,
            language_code,
            question_text,
            question_type,
            answers,
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

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')


        try:
            #client_id = request.POST['client_id']
            life_time = int(request.POST['life_time'])
            questions = json.loads(request.POST['questions'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: life_time,\
questions (JSON list of question id's). \
"""
            raise Exception('invalid/missing field')

        geo_fence = ''
        try:
            geo_gence = json.dumps(json.loads(request.POST['geo_fence']))

        except:
            pass

        # create assignment
        assignment = Assignments.create_from_http(
            DBSession,
            token,
            life_time,
            geo_fence,
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

@view_config(route_name='admin/create_message.json')
def admin_create_message(request):

    result = {'success': False}

    try:
    #if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')
 
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
            from_token = token,
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
