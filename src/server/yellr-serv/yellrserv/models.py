import os
import json
import uuid
import datetime
from time import strftime
from random import randint
import hashlib

import transaction

from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    DateTime,
    Boolean,
    Float,
    CHAR,
    )

from sqlalchemy import ForeignKey

from sqlalchemy import update, desc

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension(),expire_on_commit=False))
Base = declarative_base()

#class MyModel(Base):
#    __tablename__ = 'models'
#    id = Column(Integer, primary_key=True)
#    name = Column(Text)
#    value = Column(Integer)

#Index('my_index', MyModel.name, unique=True, mysql_length=255)

class UserTypes(Base):

    """
    Different types of users.  Administrators have the most access/privs,
    Moderators have the next leve, Subscribers the next, and then users only
    have the ability to post and view.
    """

    __tablename__ = 'usertypes'
    user_type_id = Column(Integer, primary_key=True)
    name = Column(Integer)
    description = Column(Text)

    @classmethod
    def get_from_name(cls, session, name):
        with transaction.manager:
            user_type = session.query(
                UserTypes
            ).filter(
                UserTypes.name == name
            ).first()
        return user_type

class Users(Base):

    """
    This is the user table.  It holds information for administrators, moderators,
    subscribers, and users.  If the type is a user, than a uniqueid is used to
    idenfity them.  if the user wants to be verified then, then the rest of the
    information is used.  All fields are used for admins, mods, and subs.
    """

    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    user_type_id = Column(Integer, ForeignKey('usertypes.user_type_id'))
    verified = Column(Boolean)
    client_id = Column(Text)
    user_name = Column(Text)
    first_name = Column(Text)
    last_name = Column(Text)
    organization = Column(Text)
    email = Column(Text)
    pass_salt = Column(Text)
    pass_hash = Column(Text)
    token = Column(Text)
    token_expire_datetime = Column(DateTime)

    @classmethod
    def create_new_user(cls, session, user_type_id, client_id, user_name = '',
            verified=False, first_name='', last_name='', email='',
            organization='', pass_salt=str(uuid.uuid4()),
            pass_hash=''):
        user = None
        with transaction.manager:
            user = cls(
                user_type_id = user_type_id,
                verified = verified,
                client_id = client_id,
                first_name = first_name,
                last_name = last_name,
                organization = organization,
                email = email,
                pass_salt = pass_salt,
                pass_hash = pass_hash,
            )
            session.add(user)
            transaction.commit()
        system_user = Users.get_from_user_type_name(session,'system')
        message = Messages.create_message(
            session = session,
            from_user_id = system_user.user_id,
            to_user_id = user.user_id,
            subject = 'Welcome to Yellr!',
            text = "Congratulations, you are now a part of Yellr!  You can start posting content right away!",
        )
        return user

    @classmethod
    def verify_user(cls, session, client_id, user_name, password,
            first_name = '', last_name = '', email = ''):
        with transaction.manager:
            user,created = Users.get_from_client_id(session, client_id)
            # TODO: may wan tto check to see if we just created the user, because that
            #       should never happen ...
            pass_hash = hashlib.sha256('{0}{1}'.format(
                password,
                user.pass_salt
            )).hexdigest()
            user.user_name = user_name
            user.pass_hash = pass_hash
            user.email = email
            user.verified = True
            session.add(user)
            transaction.commit()
        return user

    @classmethod
    def get_organization_from_user_id(cls, session, user_id):
        with transaction.manager:
            user = session.query(
                Users,
            ).filter(
                Users.user_id == user_id,
            ).first()
        return user.organization

    @classmethod
    def get_from_user_type_name(cls, session, user_type_name):
        with transaction.manager:
            user = session.query(
                Users,
            ).join(
                UserTypes,
            ).filter(
                Users.user_type_id == UserTypes.user_type_id,
                UserTypes.name == user_type_name,
            ).first()
        return user

    @classmethod
    def get_from_client_id(cls, session, client_id, create_if_not_exist=True):
        user = None
        created = False
        if client_id != None:
            with transaction.manager:
                user = session.query(
                    Users
                ).filter(
                    Users.client_id == client_id
                ).first()
                created = False
                if user == None and create_if_not_exist == True:
                    user_type = UserTypes.get_from_name(session,name='user')
                    user = cls.create_new_user(session,
                        user_type.user_type_id,client_id)
                    created = True
        return (user, created)

    @classmethod
    def get_from_user_id(cls, session, user_id):
        with transaction.manager:
            user = session.query(
                Users,
            ).filter(
                Users.user_id == user_id,
            ).first()
        return user

    @classmethod
    def get_from_post_id(cls, session, post_id):
        with transaction.manager:
            user = session.query(
               Users,
            ).join(
                Users,Posts.user_id,
            ).filter(
                Posts.id == post_id,
            ).first()
        return user

    @classmethod
    def get_from_token(cls, session, token):
        with transaction.manager:
            user = session.query(
                Users,
            ).filter(
                Users.token == token,
            ).first()
        return user

    @classmethod
    def get_all(cls, session):
        with transaction.manager:
            users = session.query(
                Users.user_id,
                Users.verified,
                Users.client_id,
                Users.first_name,
                Users.last_name,
                Users.organization,
                Users.email,
                UserTypes.name,
                UserTypes.description,
            ).join(
                UserTypes,
            ).filter(
                Users.user_type_id == UserTypes.user_type_id,
            ).all()
        return users

    @classmethod
    def authenticate(cls, session, user_name, password):
        with transaction.manager:
            user_user_type_id = \
                UserTypes.get_from_name(session, 'user').user_type_id
            #admin_user_type_id = \
            #    UserTypes.get_from_name(session, 'admin').user_type_id
            #mod_user_type_id = \
            #    UserTypes.get_from_name(session, 'moderator').user_type_id
            #sub_user_type_id = \
            #    UserTypes.get_from_name(session, 'subscriber').user_type_id
            #print "sys: {0}, admin: {1}, mod: {2}, sub: {3}".format(system_user_type_id, admin_user_type_id, mod_user_type_id, sub_user_type_id)
            user = session.query(
                Users,
            ).filter(
                Users.verified == True,
                Users.user_type_id != user_user_type_id, # or \
                #    Users.user_type_id == admin_user_type_id or \
                #    Users.user_type_id == mod_user_type_id or \
                #    Users.user_type_id == sub_user_type_id,
                Users.user_name == user_name,
            ).first()
            token = None
            if user != None:
                pass_hash = hashlib.sha256('{0}{1}'.format(password, user.pass_salt)).hexdigest()
                if ( user.pass_hash == pass_hash ):
                    token = str(uuid.uuid4())
                    user.token = token
                    user.token_expire_datetime = datetime.datetime.now() + \
                        datetime.timedelta(hours=24)
                    session.add(user)
                    transaction.commit()
        return token

    @classmethod
    def validate_token(cls, session, token):
        user = Users.get_from_token(session, token)
        valid = False
        if user != None:
            if user.token_expire_datetime > datetime.datetime.now():
                valid = True
        return valid, user

class Assignments(Base):

    """
    An assignment is created by a moderator and available for users to pull down.
    Assignments hold a publish date, an experation date, and a geofence (geojson)
    within them, as well as a user id to tie it to a specific user.
    """

    __tablename__ = 'assignments'
    assignment_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    publish_datetime = Column(DateTime)
    expire_datetime = Column(DateTime)
    #assignment_unique_id = Column(Text)
    top_left_lat = Column(Float)
    top_left_lng = Column(Float)
    bottom_right_lat = Column(Float)
    bottom_right_lng = Column(Float)
    use_fence = Column(Boolean)

    @classmethod
    def get_by_assignment_id(cls, session, assignment_id):
        assignment = session.query(
            QuestionAssignments
        ).filter(
            QuestionAssignments.assignment_id == assignment_id
        ).first()
        return assignment

    @classmethod
    def get_with_question(cls, session, assignment_id, language_id):
        assignment = Assignments.get_by_assignment_id(session,assignment_id)
        question = session.query(
            Questions
        ).join(
            Questions,QuestionAssignments.question_id
        ).filter(
            QuestionAssignments.assignemnt_id == assignemnt_id,
            Questions.language_id == language_id
        ).filter().first()
        return (assignment,question)

    @classmethod
    def get_all_open_with_questions(cls, session, language_code, lat, lng):
        with transaction.manager:
            language = Languages.get_from_code(session,language_code)
            assignments = session.query(
                Assignments.assignment_id,
                Assignments.publish_datetime,
                Assignments.expire_datetime,
                #Assignments.assignment_unique_id,
                Assignments.top_left_lat,
                Assignments.top_left_lng,
                Assignments.bottom_right_lat,
                Assignments.bottom_right_lng,
                Assignments.use_fence,
                Users.organization,
                Questions.question_text,
                Questions.question_type_id,
                Questions.answer0,
                Questions.answer1,
                Questions.answer2,
                Questions.answer3,
                Questions.answer4,
                Questions.answer5,
                Questions.answer6,
                Questions.answer7,
                Questions.answer8,
                Questions.answer9,
            ).join(
                Users
            ).join(
                QuestionAssignments,
            ).join(
                Questions,
            ).filter(
                # we add offsets so we can do simple comparisons
                Assignments.top_left_lat + 90 > lat + 90,
                Assignments.top_left_lng + 180 < lng + 180,
                Assignments.bottom_right_lat + 90 < lat + 90,
                Assignments.bottom_right_lng + 180 > lng + 180,
                Questions.language_id == language.language_id,
                Assignments.expire_datetime > Assignments.publish_datetime,
            ).order_by(
                desc(Assignments.expire_datetime),
            ).all()
        return assignments

    @classmethod
    def create_from_http(cls, session, token, life_time, geo_fence,
            use_fence=True):
        with transaction.manager:
            user = Users.get_from_token(session, token)
            assignment = None
            if user != None:
                assignment = Assignments(
                    user_id = user.user_id,
                    publish_datetime = datetime.datetime.now(),
                    expire_datetime = datetime.datetime.now() + \
                        datetime.timedelta(hours=life_time),
                    #assignment_unique_id = str(uuid.uuid4()),
                    top_left_lat = geo_fence['top_left_lat'],
                    top_left_lng = geo_fence['top_left_lng'],
                    bottom_right_lat = geo_fence['bottom_right_lat'],
                    bottom_right_lng = geo_fence['bottom_right_lng'],
                    use_fence = use_fence,
                )
                session.add(assignment)
                transaction.commit()
        return assignment

    @classmethod
    def update_assignment(cls, session, assignment_id, life_time, \
            top_left_lat, top_left_lng, bottom_right_lat, bottom_right_lng, \
            use_fence=True):
        with transaction.manager:
            assignment = session.query(
                Assignments,
            ).filter(
                Assignments.assignment_id == assignment_id,
            ).first()
            expire_datetime = assignment.publish_datetime + \
                datetime.timedelta(hours=life_time)
            assignment.expire_datetime = expire_datetime
            assignment.top_left_lat = top_left_lat
            assignment.top_left_lng = top_left_lng
            assignment.bottom_right_lat = bottom_right_lat
            assignment.bottom_right_lng = bottom_right_lng
            assignment.use_fence = use_fence
            session.add(assignment)
            transaction.commit()
        return assignment

class QuestionTypes(Base):

    """
    A collection of different types of questions.  This can be free text,
    multiple choice, etc.
    """

    __tablename__ = 'questiontypes'
    question_type_id = Column(Integer, primary_key=True)
    question_type = Column(Text)
    question_type_description = Column(Text)

    @classmethod
    def get_from_type(cls, session, question_type):
        with transaction.manager:
            question_type = session.query(
                QuestionTypes,
            ).filter(
                QuestionTypes.question_type == question_type,
            ).first()
        return question_type

    @classmethod
    def get_all(cls, session):
        with transaction.manager:
            question_types = session.query(
                QuestionTypes.question_type_id,
                QuestionTypes.question_type,
                QuestionTypes.question_type_description,
            ).all()
        return question_types

class Questions(Base):

    """
    A list of questions that assignments are tied to.  Each question has a language with
    it, thus the same question in multiple languages may exist.  There are 10 possible
    answer fields as to keep our options open.  Question type is used by the client
    on how to display the answer fields.
    """

    __tablename__ = 'questions'
    question_id = Column(Integer, primary_key=True)
    language_id = Column(Integer, ForeignKey('languages.language_id'))
    question_text = Column(Text)
    question_type_id = Column(Integer, ForeignKey('questiontypes.question_type_id'))
    answer0 = Column(Text)
    answer1 = Column(Text)
    answer2 = Column(Text)
    answer3 = Column(Text)
    answer4 = Column(Text)
    answer5 = Column(Text)
    answer6 = Column(Text)
    answer7 = Column(Text)
    answer8 = Column(Text)
    answer9 = Column(Text)

    @classmethod
    def create_from_http(cls, session, language_code, question_text,
            question_type, answers):
        with transaction.manager:
            question = None
            if len(answers) == 10:
                language = Languages.get_from_code(session, language_code)
                question_type = QuestionTypes.get_from_type(
                    session,
                    question_type
                )
                question = Questions(
                    language_id = language.language_id,
                    question_text = question_text,
                    question_type_id = question_type.question_type_id,
                    answer0 = answers[0],
                    answer1 = answers[1],
                    answer2 = answers[2],
                    answer3 = answers[3],
                    answer4 = answers[4],
                    answer5 = answers[5],
                    answer6 = answers[6],
                    answer7 = answers[7],
                    answer8 = answers[8],
                    answer9 = answers[9],
                )
                session.add(question)
                transaction.commit()
        return question

class QuestionAssignments(Base):

    """
    This table holds the connection between assignments and questions.  There can be
    multiple questions per assignment due to naturalization (multiple languages, same
    question).
    """

    __tablename__ = 'question_assignmenets'
    question_assignment_id = Column(Integer, primary_key=True)
    assignment_id = Column(Integer, ForeignKey('assignments.assignment_id'))
    question_id = Column(Integer, ForeignKey('questions.question_id'))

    @classmethod
    def create(cls, session, assignment_id, question_id):
        with transaction.manager:
            question_assignment = QuestionAssignments(
                assignment_id = assignment_id,
                question_id = question_id,
            )
            session.add(question_assignment)
            transaction.commit()
        return question_assignment

class Languages(Base):

    """
    List of available languages.  The client is responciple for picking whicg language
    it wants.
    """

    __tablename__ = 'languages'
    language_id = Column(Integer, primary_key=True)
    language_code = Column(Text)
    name = Column(Text)

    @classmethod
    def get_from_code(cls, session, language_code):
        with transaction.manager:
            language = session.query(
                Languages
            ).filter(
                Languages.language_code == language_code
            ).first()
        return language

    @classmethod
    def get_all(cls, session):
        with transaction.manager:
            languages = session.query(
                Languages.language_code,
                Languages.name,
            ).all()
        return languages

class Posts(Base):

    """
    These are the posts by users.  They can be unsolicited, or associated with a
    assignment.  The post has the users id, the optional assignment id, date/time
    language, and the lat/lng of the post.  There is a boolean option for flagging
    the post as 'innapropreate'.
    """

    __tablename__ = 'posts'
    post_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    assignment_id = Column(Integer, ForeignKey('assignments.assignment_id'))
    title = Column(Text)
    post_datetime = Column(DateTime)
    language_id = Column(Integer, ForeignKey('languages.language_id'))
    reported = Column(Boolean)
    lat = Column(Float)
    lng = Column(Float)

    @classmethod
    def create_from_http(cls, session, client_id, assignment_id, title,
            language_code, location={'lat':0,'lng':0}, media_objects=[]):
        # create post
        with transaction.manager:
            language = Languages.get_from_code(session,language_code)
            if assignment_id == None \
                   or assignment_id == '' \
                   or assignment_id == 0:
                assignment_id = None
            user,created = Users.get_from_client_id(session,client_id)
            post = cls(
                user_id = user.user_id,
                assignment_id = assignment_id,
                title = title,
                post_datetime = datetime.datetime.now(),
                language_id = language.language_id,
                reported = False,
                lat = location['lat'],
                lng = location['lng'],
            )
            session.add(post)
            transaction.commit()
        # assign media objects to the post
        with transaction.manager:
            for media_id in media_objects:
                media_object = MediaObjects.get_from_media_id(
                    session,
                    media_id,
                )
                post_media_object = PostMediaObjects(
                    post_id = post.post_id,
                    media_object_id = media_object.media_object_id,
                )
                session.add(post_media_object)
            transaction.commit()
        return (post, created)

    @classmethod
    def get_all_from_user_id(cls, session, user_id, reported=False):
        with transaction.manager:
            posts = session.query(
                Posts.post_id,
                Posts.title,
                Posts.post_datetime,
                Posts.reported,
                Posts.lat,
                Posts.lng,
                Posts.assignment_id,
                Users.verified,
                Users.client_id,
                Users.first_name,
                Users.last_name,
                Users.organization,
                Languages.language_code,
                Languages.name,
            ).join(
                Users,
                Languages,
            ).filter(
                Posts.user_id == Users.user_id,
                Posts.language_id == Languages.language_id,
                Posts.reported == reported,
                Posts.user_id == user_id,
            ).all()
        return posts

    @classmethod
    def get_posts(cls, session, reported=False, start=0, count=0):
        with transaction.manager:
            posts_query = session.query(
                Posts.post_id,
                Posts.title,
                Posts.post_datetime,
                Posts.reported,
                Posts.lat,
                Posts.lng,
                Posts.assignment_id,
                Users.verified,
                Users.client_id,
                Users.first_name,
                Users.last_name,
                Users.organization,
                Languages.language_code,
                Languages.name,
            ).join(
                Users,
                Languages,
            ).filter(
                Posts.user_id == Users.user_id,
                Posts.language_id == Languages.language_id,
                Posts.reported == reported,
            ).order_by(
                desc(Posts.post_datetime),
            )
            total_post_count = posts_query.count()
            if start == 0 and count == 0:
                posts = posts_query.all()
            else:
                posts = posts_query.slice(start, start+count)
        return posts, total_post_count

    @classmethod
    def get_all_from_assignment_id(cls, session, assignment_id, start=0,
            count=0):
        with transaction.manager:
            posts_query = session.query(
                Posts.post_id,
                Posts.assignment_id,
                Posts.user_id,
                Posts.title,
                Posts.post_datetime,
                Posts.reported,
                Posts.lat,
                Posts.lng,
                MediaObjects.media_object_id,
                MediaObjects.media_id,
                MediaObjects.file_name,
                MediaObjects.caption,
                MediaObjects.media_text,
                MediaTypes.name,
                MediaTypes.description,
                Users.verified,
                Users.client_id,
                Languages.language_code,
                Languages.name,
            ).join(
                PostMediaObjects,
            ).join(
                MediaObjects,
            ).join(
                MediaTypes,
            ).join(
                Users,Users.user_id == Posts.post_id,
            ).join(
                Languages,
            ).filter(
                Posts.assignment_id == assignment_id,
            ).order_by(
                 desc(Posts.post_datetime),
            )
            total_post_count = posts_query.count()
            if start == 0 and count == 0:
                posts = posts_query.all()
            else:
                posts = posts_query.slice(start, start+count)
        return posts, total_post_count

    @classmethod
    def get_all_from_collection_id(cls, session, collection_id, 
            start=0, count=0):
        with transaction.manager:
            posts_query = session.query(
                Posts.post_id,
                Posts.assignment_id,
                Posts.user_id,
                Posts.title,
                Posts.post_datetime,
                Posts.reported,
                Posts.lat,
                Posts.lng,
                MediaObjects.media_object_id,
                MediaObjects.media_id,
                MediaObjects.file_name,
                MediaObjects.caption,
                MediaObjects.media_text,
                MediaTypes.name,
                MediaTypes.description,
                Users.verified,
                Users.client_id,
                Languages.language_code,
                Languages.name,
                #CollectionPosts,
            ).join(
                PostMediaObjects,
            ).join(
                MediaObjects,
            ).join(
                MediaTypes,
            ).join(
                Users,Users.user_id == Posts.post_id,
            ).join(
                Languages,
            ).join(
                CollectionPosts,
            ).filter(
                CollectionPosts.collection_id == collection_id,
            ).order_by(
                 desc(Posts.post_datetime),
            )
            total_post_count = posts_query.count()
            if start == 0 and count == 0:
                posts = posts_query.all()
            else:
                posts = posts_query.slice(start, start+count)
        return posts, total_post_count


class MediaTypes(Base):

    """
    These are the differnet types of media.  Audio, Video, Image, and Text.
    """

    __tablename__ = 'mediatypes'
    media_type_id = Column(Integer, primary_key=True)
    name = Column(Text)
    description = Column(Text)

    @classmethod
    def from_value(cls, session, name):
        with transaction.manager:
            media_type = session.query(
                MediaTypes,
            ).filter(
                MediaTypes.name == name,
            ).first()
        return media_type

class MediaObjects(Base):

    """
    Media objects are attached to a post.  A post can have any number of media objects.
    """

    __tablename__ = 'mediaobjects'
    media_object_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    media_type_id = Column(Integer, ForeignKey('mediatypes.media_type_id'))
    media_id = Column(Text)
    file_name = Column(Text)
    caption = Column(Text)
    media_text = Column(Text)

    @classmethod
    def get_from_media_id(cls, session, media_id):
        with transaction.manager:
            media_object = session.query(
                MediaObjects,
            ).filter(
                MediaObjects.media_id == media_id,
            ).first()
        return media_object

    @classmethod
    def get_from_post_id(cls, session, post_id):
        with transaction.manager:
            media_objects = session.query(
                MediaObjects.file_name,
                MediaObjects.caption,
                MediaObjects.media_text,
                MediaTypes.name,
                MediaTypes.description,
            ).join(
                PostMediaObjects,
                MediaTypes,
            ).filter(
                PostMediaObjects.media_object_id == MediaObjects.media_object_id,
                PostMediaObjects.post_id == post_id,
                MediaTypes.media_type_id == MediaObjects.media_type_id,
            ).all()
        return media_objects

    @classmethod
    def create_new_media_object(cls, session, client_id, media_type_value,
            file_name, caption, text):
        with transaction.manager:
            user,created = Users.get_from_client_id(session,client_id)
            mediatype = MediaTypes.from_value(session,media_type_value)
            mediaobject = cls(
                user_id = user.user_id,
                media_type_id = mediatype.media_type_id,
                media_id = str(uuid.uuid4()),
                file_name = file_name,
                caption = caption,
                media_text = text,
            )
            session.add(mediaobject)
            transaction.commit()
        return mediaobject, created

class PostMediaObjects(Base):

    """
    There can be multiple media objects associated with a post, thus this table allows
    for the linking of multiple media objects to a single post id.
    """

    __tablename__ = 'postmediaobjects'
    post_media_object_id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey('posts.post_id'))
    media_object_id = Column(Integer, ForeignKey('mediaobjects.media_object_id'))

    @classmethod
    def create_new_postmediaobject(cls, session, post_id, media_object_id):
        with transaction.manager:
            post_media_object = cls(
                post_id = post_id,
                media_object_id = media_objectid,
            )

class Stories(Base):

    """
    This is used to hold the 'store front' stories for the site.  These
    stories are writen in markdown and html, and reference media objects.
    """

    __tablename__ = 'stories'
    story_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    story_unique_id = Column(Text)
    publish_datetime = Column(DateTime)
    edited_datetime = Column(DateTime, nullable=True)
    title = Column(Text)
    tags = Column(Text)
    top_text = Column(Text)
    media_object_id = Column(Integer, \
        ForeignKey('mediaobjects.media_object_id'))
    contents = Column(Text)
    top_left_lat = Column(Float)
    top_left_lng = Column(Float)
    bottom_right_lat = Column(Float)
    bottom_right_lng = Column(Float)
    #use_fense = Column(Boolean)
    language_id = Column(Integer, ForeignKey('languages.language_id'))

    @classmethod
    def create_from_http(cls, session, token, title, tags, top_text, \
            media_id, contents, top_left_lat, top_left_lng, \
            bottom_right_lat, bottom_right_lng, use_fence=True, \
            language_code=''):
        with transaction.manager:
            user = Users.get_from_token(session, token)
            media_object = MediaObjects.get_from_media_id(
                session,
                media_id,
            )
            language = Languages.get_from_code(session, language_code)
            story = cls(
                user_id = user.user_id,
                story_unique_id = str(uuid.uuid4()),
                publish_datetime = datetime.datetime.now(),
                edited_datetime = None,
                title = title,
                tags = tags,
                top_text = top_text,
                media_object_id = media_object.media_object_id,
                contents = contents,
                top_left_lat = top_left_lat,
                top_left_lng = top_left_lng,
                bottom_right_lat = bottom_right_lat,
                bottom_right_lng = bottom_right_lng,
                #use_fence = use_fence,
                language_id = language.language_id,
            )
            session.add(story)
            transaction.commit()
        return story

    @classmethod
    def get_stories(cls, session, lat, lng, language_code, start=0, count=0):
        with transaction.manager:
            stories_query = session.query(
                Stories.story_unique_id,
                Stories.publish_datetime,
                Stories.edited_datetime,
                Stories.title,
                Stories.tags,
                Stories.top_text,
                Stories.contents,
                Stories.top_left_lat,
                Stories.top_left_lng,
                Stories.bottom_right_lat,
                Stories.bottom_right_lng,
                Users.first_name,
                Users.last_name,
                Users.organization,
                Users.email,
                MediaObjects.file_name,
                MediaObjects.media_id,
            ).join(
                Users,Stories.user_id == Users.user_id,
            ).join(
                MediaObjects,Stories.media_object_id == \
                    MediaObjects.media_object_id,
            )
            stories_filter_query = stories_query
            if language_code != '':
                language = Languages.get_from_code(session, language_code)
                stories_filter_query = stories_filter_query.filter(
                    Stories.language_id == language.language_id,
                )
            stories_filter_query = stories_filter_query.filter(
                Stories.top_left_lat + 90 > lat + 90,
                Stories.top_left_lng + 180 < lng + 180,
                Stories.bottom_right_lat + 90 < lat + 90,
                Stories.bottom_right_lng + 180 > lng + 180,
                # Stories.user_fense == True,
            ).order_by(
                 desc(Stories.publish_datetime),
            )
            total_story_count = stories_filter_query.count()
            if start == 0 and count == 0:
                stories = stories_filter_query.all()
            else:
                stories = posts_query.slice(start, start+count)
        return stories, total_story_count


class EventLogs(Base):

    """
    This is used as a debugging tool to keep track of how the application is
    being used, and how often clients are accessing the website.
    """

    __tablename__ = 'clientlogs'
    event_log_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    event_type = Column(Text)
    event_datetime = Column(DateTime)
    details = Column(Text)

    @classmethod
    def log(cls, session, client_id, event_type, details):
        with transaction.manager:
            user,created = Users.get_from_client_id(session,client_id)
            user_id = 0
            if user != None:
                user_id = user.user_id
            eventlog = EventLogs(
                user_id = user_id,
                event_type = event_type,
                event_datetime = datetime.datetime.now(),
                details = details,
            )
            session.add(eventlog)
        return eventlog

    @classmethod
    def get_all(cls, session):
        with transaction.manager:
            eventlogs = session.query(
                EventLogs
            ).all()
        return eventlogs

class Collections(Base):

    """
    Collections are a means to organize posts, and are used by moderators and
    subscribers.
    """

    __tablename__ = 'collections'
    collection_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    collection_datetime = Column(DateTime)
    name = Column(Text)
    description = Column(Text)
    tags = Column(Text)
    enabled = Column(Boolean)
    #private = Column(Boolean)

    @classmethod
    def get_from_collection_id(cls, session, collection_id):
        with transaction.manager:
            collection = session.query(
                Collections,
            ).filter(
                Collections.collection_id == collection_id,
            ).first()
        return collection

    @classmethod
    def create_new_collection_from_http(cls, session, token, name,
            description='', tags=''):
        with transaction.manager:
            user = Users.get_from_token(session, token)
            collection = cls(
                user_id = user.user_id,
                collection_datetime = datetime.datetime.now(),
                name = name,
                description = description,
                tags = tags,
                enabled = True,
            )
            session.add(collection)
            transaction.commit()
        return collection

    @classmethod
    def disable_collection(cls, session, collection_id):
        with transaction.manager:
            collection = session.query(
                Collections,
            ).filter(
                Collections.collection_id == collection_id,
            ).first()
            collection.enabled = False
            session.add(collection)
            transaction.commit()
        return collection

    @classmethod
    def add_post_to_collection(cls, session, collection_id, post_id):
        with transaction.manager:
            collection_post = CollectionPosts(
                collection_id = collection_id,
                post_id = post_id,
            )
            session.add(collection_post)
            transaction.commit()
        return collection_post

    @classmethod
    def remove_post_from_collection(cls, session, collection_id, post_id):
        with transaction.manager:
            collection_post = session.query(
                CollectionPosts,
            ).filter(
                CollectionPosts.collection_id == collection_id,
                CollectionPosts.post_id == post_id,
            ).first()
            success = False
            if collection_post != None:
                session.delete(collection_post)
                transaction.commit()
                success = True
        return success

class CollectionPosts(Base):

    """
    Table to link posts to a collection.
    """

    __tablename__ = 'collection_posts'
    collection_post_id = Column(Integer, primary_key=True)
    collection_id = Column(Integer, ForeignKey('collections.collection_id'))
    post_id = Column(Integer, ForeignKey('posts.post_id'))

    @classmethod
    def create_new_collectionpost(cls, session, collection_id, post_id):
        with transaction.manager:
            collection_post = cls(
                collection_id = collection_id,
                post_id = post_id,
            )
        return collection_post

class Notifications(Base):

    """ This table holds notifications for a user.

        valid types:
            post_successful
                payload = {
                    'post_id': 0,
                    'title': '',
                }

            post_viewed
                payload = {
                    'organization': '',
                }

            new_message
                payload = {
                    'organization': '',
                }

            message_sent
                payload = {
                    'message_subject': ''
                }

    """

    __tablename__ = 'notifications'
    notification_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    notification_datetime = Column(DateTime)
    notification_type = Column(Text)
    payload = Column(Text)

    @classmethod
    def get_notifications_from_client_id(cls, session, client_id):
        with transaction.manager:
            user,created = Users.get_from_client_id(session, client_id)
            notifications = session.query(
                Notifications.notification_id,
                Notifications.notification_datetime,
                Notifications.notification_type,
                Notifications.payload,
            ).filter(
                Notifications.user_id == user.user_id,
            ).all() #.limit(25).all()
            # update table
        return notifications, created

    @classmethod
    def create_notification(cls, session, user_id, notification_type, payload):
        with transaction.manager:
            notification = cls(
                user_id = user_id,
                notification_datetime = datetime.datetime.now(),
                notification_type = notification_type,
                payload = payload,
            )
            session.add(notification)
            transaction.commit()
        return notification

class Messages(Base):

    """
    Messages holds the messages to users from moderators and/or subscribers, as
    well as the users response messages.
    """

    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True)
    from_user_id = Column(Integer, ForeignKey('users.user_id'))
    to_user_id = Column(Integer, ForeignKey('users.user_id'))
    message_datetime = Column(DateTime)
    parent_message_id = Column(Integer, \
        ForeignKey('messages.message_id'), nullable=True)
    subject = Column(Text)
    text = Column(Text)
    was_read = Column(Text)

    @classmethod
    def get_user_id_from_message_id(cls, session, message_id):
        with transaction.manager:
            message = session.query(
                Messages,
            ).filter(
                Messages.message_id == message_id,
            ).first()
        return message.from_user_id

    @classmethod
    def get_from_message_id(cls, session, message_id):
        with transaction.manager:
            message = session.query(
                Messages,
            ).filter(
                Messages.message_id == message_id,
            ).first()
        return message

    @classmethod
    def create_message(cls, session, from_user_id, to_user_id, subject, text,
            parent_message_id=None):
        with transaction.manager:
            message = cls(
                from_user_id = from_user_id,
                to_user_id = to_user_id,
                message_datetime = datetime.datetime.now(),
                parent_message_id = parent_message_id,
                subject = subject,
                text = text,
                was_read = False,
            )
            session.add(message)
            transaction.commit()
        Notifications.create_notification(
            session,
            to_user_id,
            'new_message',
            json.dumps({'organization': \
                Users.get_organization_from_user_id(session, from_user_id)}),
        )
        return message

    @classmethod
    def create_message_from_http(cls, session, from_token, to_client_id, subject,
            text, parent_message_id=None):
        from_user = Users.get_from_token(session, from_token)
        to_user,created = Users.get_from_client_id(session, to_client_id)
        message = None
        if created == False:
            message = Messages.create_message(
                session = session,
                from_user_id = from_user.user_id,
                to_user_id = to_user.user_id,
                subject = subject,
                text = text,
                parent_message_id = parent_message_id,
            )
            session.add(message)
            transaction.commit()
        return message

    @classmethod
    def create_response_message_from_http(cls, session, client_id,
            parent_message_id, subject, text):
        exists = Messages.check_if_message_has_child(session, parent_message_id)
        parent_message = Messages.get_from_message_id(
            session,
            parent_message_id
        )
        message = None
        if parent_message != None and exists == False:
            from_user, created = Users.get_from_client_id(session, client_id)
            to_user_id = Messages.get_user_id_from_message_id(
                session,
                parent_message_id
            )
            with transaction.manager:
                message = cls(
                    from_user_id = from_user.user_id,
                    to_user_id = to_user_id,
                    message_datetime = datetime.datetime.now(),
                    parent_message_id = parent_message_id,
                    subject = subject,
                    text = text,
                    was_read = False,
                )
                session.add(message)
                transaction.commit()
            Notifications.create_notification(
                session,
                to_user_id,
                'new_message',
                json.dumps({'parent_message_id': parent_message_id}),
            )
        return message

    @classmethod
    def check_if_message_has_child(cls, session, parent_message_id):
        with transaction.manager:
            message = session.query(
                Messages,
            ).filter(
                Messages.parent_message_id == parent_message_id,
            ).first()
            exists = False
            if message != None:
                exists = True
        return exists

    @classmethod
    def mark_as_read(cls, session, client_id, message_id):
        with transaction.manager:
            user = Users.get_from_client_id(session, client_id)
            message = session.query(
                Messages,
            ).filter(
                Messages.message_id == message_id,
                # only the recipiant can mark as read.
                Messages.to_user_id == user.user_id,
            ).first()
            message.was_read = True
            session.add(message)
            transaction.commit()
        return message

    # TODO: make this not have to itterate through all the messages ...
    @classmethod
    def mark_all_as_read(cls, session, user_id):
        with transaction.manager:
            message = 0
            while message != None:
                message = session.query(
                    Messages,
                ).filter(
                    Messages.to_user_id == user_id,
                    Messages.was_read == False,
                ).first()
                if message != None:
                    break
                message.was_read = True
                session.add(message)
                transaction.commit()
        return True

    @classmethod
    def get_messages_from_client_id(cls, session, client_id):
        with transaction.manager:
            user,created = Users.get_from_client_id(
                session,
                client_id,
                create_if_not_exist=False,
            )
            messages = []
            if user != None:
                messages = session.query(
                    Messages.from_user_id,
                    Messages.to_user_id,
                    Messages.message_datetime,
                    Messages.parent_message_id,
                    Messages.subject,
                    Messages.text,
                    Messages.was_read,
                    Users.organization,
                    Users.first_name,
                    Users.last_name,
                ).join(
                    Users,Users.user_id == Messages.from_user_id,
                ).filter(
                    Messages.to_user_id == user.user_id,
                    Messages.was_read == False,
                ).all()
        #print "Messages:"
        #print messages
        #print
        for m in messages:
            #print "Message:"
            #print m
            #print
            Messages.mark_all_as_read(session,m[1])
        return messages

class DebugSubmissions(Base):

    """ This class is for debug purposes, and will hold debug information
        sent from the client.
    """

    __tablename__ = 'debug_submissions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    debug_text = Column(Text)
    sumbission_datetime = Column(DateTime)

    @classmethod
    def create_new_submission(cls, session, client_id, debug_text):
        with transaction.manager:
            user = Users.get_from_client_id(session, client_id)
            submission = cls(
                id = user.id,
                debug_text = debug_text,
                submission_datetime = datetime.datetime.now(),
            )
        return submission

    @classmethod
    def get_all_submissions(cls, session):
        with transaction.manager:
            submissions = session.query(
                DebugSubmissions,
            ).all()
        return submissions

