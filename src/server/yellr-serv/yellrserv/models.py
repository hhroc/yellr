import os
import json
import uuid
import datetime
from time import strftime

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
    usertypeid = Column(Integer, primary_key=True)
    usertypedescription = Column(Text)
    usertypevalue = Column(Integer)

    @classmethod
    def from_value(cls,session,value):
        usertype = None
        with transaction.manager:
            usertype = session.query(UserTypes).filter(UserTypes.usertypevalue == value).first()
        return usertype

class Users(Base):

    """
    This is the user table.  It holds information for administrators, moderators,
    subscribers, and users.  If the type is a user, than a uniqueid is used to
    idenfity them.  if the user wants to be verified then, then the rest of the
    information is used.  All fields are used for admins, mods, and subs.
    """
    
    __tablename__ = 'users'
    userid = Column(Integer, primary_key=True)
    usertypeid = Column(Integer, ForeignKey('usertypes.usertypeid'))
    verified = Column(Boolean)
    uniqueid = Column(Text)
    firstname = Column(Text)
    lastname = Column(Text)
    organization = Column(Text)
    email = Column(Text)
    passsalt = Column(Text)
    passhash = Column(Text)

    @classmethod
    def create_new_user(cls,session,usertypeid,clientid,verified=False,firstname='',lastname='',email='',organization='',passsalt='',passhash=''):
        user = None
        with transaction.manager:
            user = cls(
                usertypeid = usertypeid,
                verified = verified,
                uniqueid = clientid,
                firstname = firstname,
                lastname = lastname,
                organization = organization,
                email = email,
                passsalt = passsalt,
                passhash = passhash,
            )
            session.add(user)
            transaction.commit()
            # Debug/Log
            #eventdetails = {
            #    'eventtype': 'user_creation',
            #    'clientid': clientid,
            #    'datetime': str(strftime("%Y-%m-%d %H:%M:%S")),
            #}
            #ClientLogs.log(session,clientid,json.dumps(eventdetails))
        return user

    @classmethod
    def get_from_uniqueid(cls,session,uniqueid):
        user = None
        with transaction.manager:
            user = session.query(Users).filter(Users.uniqueid == uniqueid).first()
            created = False
            if user == None:
                usertype = UserTypes.from_value(session,value='user')
                user = cls.create_new_user(session,usertype.usertypeid,uniqueid)
                created = True
        return (user, created)

class Assignments(Base):

    """
    An assignment is created by a moderator and available for users to pull down.
    Assignments hold a publish date, an experation date, and a geofence (geojson)
    within them, as well as a user id to tie it to a specific user.
    """

    __tablename__ = 'assignments'
    assignmentid = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.userid'))
    publishdate = Column(DateTime)
    expiredatetime = Column(DateTime)
    fencegeojson = Column(Text)

    @classmethod
    def get_by_assignmentid(cls,session,assignmentid):
        assignment = questionassignments = session.query(
            QuestionAssignments
        ).filter(
            QuestionAssignments.assignemntid == assignemntid
        ).first()
        return assignment

    @classmethod
    def get_with_question(cls,session,assignmentid,languageid):
        assignment = Assignments.get_by_assignmentid(session,assignmentid)
        question = session.query(
            Questions
        ).join(
            Questions,QuestionAssignments.questionid
        ).filter(
            QuestionAssignments.assignemntid == assignemntid,
            Questions.languageid == languageid
        ).filter().first()
        return (assignment,question)
            

class Questions(Base):

    """
    A list of questions that assignments are tied to.  Each question has a language with
    it, thus the same question in multiple languages may exist.  There are 10 possible
    answer fields as to keep our options open.  Question type is used by the client
    on how to display the answer fields.
    """

    __tablename__ = 'questions'
    questionid = Column(Integer, primary_key=True)
    languageid = Column(Integer, ForeignKey('languages.languageid'))
    questiontext = Column(Text)
    questiontype = Column(Integer)
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

class QuestionAssignments(Base):

    """
    This table holds the connection between assignments and questions.  There can be
    multiple questions per assignment due to naturalization (multiple languages, same
    question).
    """

    __tablename__ = 'questionassignmenets'
    questionassignmentid = Column(Integer, primary_key=True)
    assignemntid = Column(Integer, ForeignKey('assignments.assignmentid'))
    questionid = Column(Integer, ForeignKey('questions.questionid'))

class Languages(Base):

    """
    List of available languages.  The client is responciple for picking whicg language
    it wants.
    """

    __tablename__ = 'languages'
    languageid = Column(Integer, primary_key=True)
    languagecode = Column(Text)
    languagename = Column(Text)

    @classmethod
    def get_from_code(cls,session,languagecode):
        language = session.query(Languages).filter(Languages.languagecode == languagecode).first()
        return language

class Posts(Base):

    """
    These are the posts by users.  They can be unsolicited, or associated with a 
    assignment.  The post has the users id, the optional assignment id, date/time
    language, and the lat/lng of the post.  There is a boolean option for flagging
    the post as 'innapropreate'.
    """

    __tablename__ = 'posts'
    postid = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.userid'))
    assignmentid = Column(Integer, ForeignKey('assignments.assignmentid'))
    postdatetime = Column(DateTime)
    languageid = Column(Integer, ForeignKey('languages.languageid'))
    reported = Column(Boolean)
    lat = Column(Float)
    lng = Column(Float)

    @classmethod
    def create_from_http(cls,session,clientid,assignmentid,languagecode,location,mediaobjects):
        # create post
        with transaction.manager:
            language = Languages.get_from_code(session,languagecode)
            if assignmentid == None or assignmentid == '' or assignmentid == 0:
                assignmentid = None
            user,created = Users.get_from_uniqueid(session,clientid)
            post = cls(
                userid = user.userid,
                assignmentid = assignmentid,
                postdatetime = datetime.datetime.now(),
                languageid = language.languageid,
                reported = False,
                lat = location['lat'],
                lng = location['lng'],
            )
            session.add(post)
            transaction.commit()
        # assign media objects to the post
        with transaction.manager:
            for mediaobjectuniqueid in mediaobjects:
                mediaobject = MediaObjects.get_from_uniqueid(session,mediaobjectuniqueid)
                postmediaobject = PostMediaObjects(
                    postid = post.postid,
                    mediaobjectid = mediaobject.mediaobjectid,
                )
                session.add(postmediaobject)
            transaction.commit()
        return (post, created)

class PostViews(Base):

    """
    This holds the event of a moderator or subscriber viewing a users post.  This
    is a nice way to give feedback to the user that someone is actually looking at
    their content.
    """

    __tablename__ = 'postviews'
    postviewid = Column(Integer, primary_key=True)
    viewinguserid = Column(Integer, ForeignKey('users.userid')
    postid = Column(Integer, ForeignKey('posts.postid')
    viewdatetime = Column(DateTime)
    acknowledged = Column(Boolean)

    @classmethod
    def create_new_postview(cls,session,viewinguserid,postid):
        with transaction.manager:
            postview = cls(
                viewinguserid = viewinguserid,
                postid = postid,
                viewdatetime = datetime.datetime.now()
                acknowledged = False,
            )
        return postview

    @classmethod
    def get_unacknowledged_from_uniqueid(cls,session,uniqueid):
        with transaction.manager:
            user = Users.get_from_uniqueid(uniqueid)
            postviews = session.query(
                PostViews
            ).join(
                PostViews, Posts.postid,
            ).filter(
                Posts.userid = user.userid,
                PostViews.acknowledged = False,
            )
        return postviews

class MediaTypes(Base):

    """
    These are the differnet types of media.  Audio, Video, Image, and Text.
    """

    __tablename__ = 'mediatypes'
    mediatypeid = Column(Integer, primary_key=True)
    mediatypevalue = Column(Text)
    mediatypedescription = Column(Text)

    @classmethod
    def from_value(cls,session,value):
        mediatype = 0
        with transaction.manager:
            mediatype = session.query(MediaTypes).filter(MediaTypes.mediatypevalue == value).first()
        return mediatype

class MediaObjects(Base):

    """
    Media objects are attached to a post.  A post can have any number of media objects.
    """

    __tablename__ = 'mediaobjects'
    mediaobjectid = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.userid'))
    mediatypeid = Column(Integer, ForeignKey('mediatypes.mediatypeid'))
    mediaobjectuniqueid = Column(Text)
    mediafilename = Column(Text)
    mediacaption = Column(Text)
    mediatext = Column(Text)

    @classmethod
    def get_from_uniqueid(cls,session,uniqueid):
        with transaction.manager:
            mediaobject = session.query(MediaObjects).filter(MediaObjects.mediaobjectuniqueid == uniqueid).first()
        return mediaobject

    @classmethod
    def create_new_mediaobject(cls,session,clientid,mediatypevalue,filename,caption,text):
        with transaction.manager:
            user,created = Users.get_from_uniqueid(session,clientid)
            mediatype = MediaTypes.from_value(session,mediatypevalue)
            mediaobject = cls(
                userid = user.userid,
                mediatypeid = mediatype.mediatypeid,
                mediaobjectuniqueid = str(uuid.uuid4()),
                mediafilename = filename,
                mediacaption = caption,
                mediatext = text,
            )
            session.add(mediaobject)
            transaction.commit()
        return mediaobject

class PostMediaObjects(Base):

    """
    There can be multiple media objects associated with a post, thus this table allows
    for the linking of multiple media objects to a single post id.
    """

    __tablename__ = 'postmediaobjects'
    postmediaobjectid = Column(Integer, primary_key=True)
    postid = Column(Integer, ForeignKey('posts.postid'))
    mediaobjectid = Column(Integer)

    @classmethod
    def create_new_postmediaobject(cls,session,postid,mediaobjectid):
        with transaction.manager:
            postmediaobject = cls(
                postid = postid,
                mediaobjectid = mediaobjectid,
            )

class ClientLogs(Base):

    """
    This is used as a debugging tool to keep track of how the application is
    being used, and how often clients are accessing the website.
    """

    __tablename__ = 'clientlogs'
    clientlogid = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.userid'))
    eventdatetime = Column(DateTime)
    eventdetails = Column(Text)

    @classmethod
    def log(cls,session,clientid,eventdetails):
        with transaction.manager:
            user,created = Users.get_from_uniqueid(session,clientid)
            clientlog = ClientLogs(
                userid = user.userid,
                eventdatetime = datetime.datetime.now(),
                eventdetails = eventdetails,
            )
            session.add(clientlog)
        return clientlog

class Collections(Base):

    """
    Collections are a means to organize posts, and are used by moderators and
    subscribers.
    """

    __tablename__ = 'collections'
    collectionid = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.userid'))
    collectiondatetime = Column(DateTime)
    collectionname = Column(Text)
    collectiondescription = Column(Text)

    @classmethod
    def create_new_collection(cls,session,userid,collectionname,collectiondescription,collectiontag=''):
        with transaction.manager:
            collection = cls(
                userid = userid,
                collectiondatetime = datetime.datetime.now(),
                collectioname = collectionname,
                collectiondescription = collectiondescription,
                collectiontag = collectiontag,
            )
        return collection

class CollectionPosts(Base):

    """
    Table to link posts to a collection.
    """

    __tablename__ = 'collectionposts'
    collectionpostid = Column(Integer, primary_key=True)
    collectionid = Column(Integer, ForeignKey('collections.collectionid'))
    postid = Column(Integer, ForeignKey('posts.postid'))

    @classmethod
    def create_new_collectionpost(cls,session,collectionid,postid):
        with transaction.manager:
            collectionpost = cls(
                collectionid = collectionid,
                postid = postid,
            )
        return collectionpost

class Messages(Base):

    """
    Messages holds the messages to users from moderators and/or subscribers, as
    well as the users response messages.
    """

    __tablename__ = 'messages'
    messageid = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.userid')
    messagedatetime = Column(DateTime)
    parentmessageid = Column(Integer, ForeignKey('messages.messageid')
    messagesubject = Column(Text)
    messagetext = Column(Text)
    messagewasread = Column(Text)    

    @classmethod
    def create_message(cls,session,userid,messagesubject,messagetext):
        with transaction.manager:
            message = cls(
                userid = userid,
                messagedatetime = datetime.datetime.now(),
                parentmessageid = None,
                messagesubject = messagesubject,
                messagetext = messagetext,
                messagewasread = False,
            )

    @classmethod
    def create_response_message(cls,session,clientid,parentmessageid,messagetext):
        with transaction.manager:
            user,created = Users.get_from_uniqueid(session,clientid)
            message = cls(
                userid = user.userid,
                messagedatetime = datetime.datetime.now(),
                parentmessageid = parentmessageid,
                messagesubject = messagesubject,
                messagetext = messagetext,
                messagewasread = False,
            )
        return message

    @classmethod
    def mark_as_read(cls,session,messageid):
        with transaction.manager:
            session.update().\
                where(Messages.messageid = messageid).\
                values(messagewasread = True)
            transaction.commit()
        return True

