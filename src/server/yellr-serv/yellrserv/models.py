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

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
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
    email = Column(Text)
    passsalt = Column(Text)
    passhash = Column(Text)

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

class MediaTypes(Base):

    """
    These are the differnet types of media.  Audio, Video, Image, and Text.
    """

    __tablename__ = 'mediatypes'
    mediatypeid = Column(Integer, primary_key=True)
    mediatype = Column(Text)
    mediatypedescription = Column(Text)

class Mediaobjects(Base):

    """
    Media objects are attached to a post.  A post can have any number of media objects.
    """

    __tablename__ = 'mediaobjects'
    mediaobjectid = Column(Integer, primary_key=True)
    mediatypeid = Column(Integer, ForeignKey('mediatypes.mediatypeid'))
    mediafilename = Column(Text)
    mediacaption = Column(Text)
    mediatext = Column(Text)

class PostMediaObjects(Base):

    """
    There can be multiple media objects associated with a post, thus this table allows
    for the linking of multiple media objects to a single post id.
    """

    __tablename__ = 'postmediaobjects'
    postmediaobjectid = Column(Integer, primary_key=True)
    postid = Column(Integer, ForeignKey('posts.postid'))
    mediaobjectid = Column(Integer)

class ClientLogs(Base):

    """
    This is used as a debugging tool to keep track of how the application is
    being used, and how often clients are accessing the website.
    """

    __tablename__ = 'clientlogs'
    clientlogid = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.userid'))
    eventdatetime = Column(DateTime)
    eventtypeclienttype = Column(Text)
    eventtype = Column(Text)
    eventdetails = Column(Text)

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

class CollectionPosts(Base):

    """
    Table to link posts to a collection.
    """

    __tablename__ = 'collectionposts'
    collectionpostid = Column(Integer, primary_key=True)
    collectionid = Column(Integer, ForeignKey('collections.collectionid'))
    postid = Column(Integer, ForeignKey('posts.postid'))

