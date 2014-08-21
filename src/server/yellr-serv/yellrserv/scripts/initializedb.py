import os
import sys
import uuid
import datetime
import json

import transaction

from sqlalchemy import engine_from_config

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models import (
    DBSession,
    Base,
    UserTypes,
    MediaTypes,
    Languages,
    Users,
    Assignments,
    Questions,
    QuestionAssignments,
    QuestionTypes,
    )


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.create_all(engine)
    with transaction.manager:
        #
        # User Types
        #
        usertype_system = UserTypes(
            description = 'The system user.',
            name = 'system',
        )
        DBSession.add(usertype_system)
        usertype_admin = UserTypes(
            description = 'A system administrator.  This user type has the highest level of permissions.',
            name = 'admin',
        )
        DBSession.add(usertype_admin)
        usertype_mod = UserTypes(
            description = 'A system moderator.  This user type moderators content produced by users.',
            name = 'moderator',
        )
        DBSession.add(usertype_mod)
        usertype_sub = UserTypes(
            description = 'A system subscriber.  This user type uses content produced by moderators and users.',
            name = 'subscriber',
        )
        DBSession.add(usertype_sub)
        usertype_user = UserTypes(
            description = 'A basic user.  Accesses the system via mobile app or webpage.',
            name = 'user',
        )
        DBSession.add(usertype_user)

        #
        # Media Types
        #
        mediatype_image = MediaTypes(
            description = 'An Image.',
            name = 'image',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            description = 'An Audio Clip.',
            name = 'audio',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            description = 'A Video.',
            name = 'video',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            description = 'Text.',
            name = 'text',
        )
        DBSession.add(mediatype_image)

        # Languages
        language_english = Languages(
            language_code = 'en',
            name = 'English',
        )
        DBSession.add(language_english)
        language_spanish = Languages(
            language_code = 'es',
            name = 'Spanish',
        )
        DBSession.add(language_spanish)

        transaction.commit()

    #with transaction.manager:

    system_user_client_id = str(uuid.uuid4())
    system_user_type = UserTypes.get_from_name(DBSession,'system')

    # create the systme user
    system_user = Users.create_new_user(
        session = DBSession,
        user_type_id = system_user_type.user_type_id,
        client_id = system_user_client_id,
        #verified = True,
        #user_name = '',
        first_name = 'SYSTEM USER',
        last_name = 'SYSTEM USER',
        email = '',
        organization = 'Yellr',
        #pass_salt = '',
        #pass_hash = 'hash', # NOTE: will never be the result of a md5 hash
    )
    
    # set the system user as verified
    system_user = Users.verify_user(
        session = DBSession,
        client_id = system_user_client_id,
        user_name = 'system',
        password = 'password',
        email=''
    )

    with transaction.manager:
        question_type_free_text = QuestionTypes(
            question_type = 'free_text',
            question_type_description = 'Free form text responce.',
        )
        DBSession.add(question_type_free_text)

        question_type_multiple_choice = QuestionTypes(
            question_type = 'multiple_choice',
            question_type_description = 'Allows for up to ten multiple \
choice options',
        )
        DBSession.add(question_type_multiple_choice)

        transaction.commit()

    with transaction.manager:
        language = Languages.get_from_code(DBSession,'en')
        question = Questions(
            language_id = language.language_id,
            question_text = 'How do you feel about broccoli?',
            question_type_id = question_type_free_text.question_type_id,
            answer0 = '',
            answer1 = '',
            answer2 = '',
            answer3 = '',
            answer4 = '',
            answer5 = '',
            answer6 = '',
            answer7 = '',
            answer8 = '',
            answer9 = '',
        )
        DBSession.add(question)

        assignment = Assignments(
            user_id = 1,
            publish_datetime = datetime.datetime.now(),
            expire_datetime = \
                datetime.datetime.now() + datetime.timedelta(days=30),

            # approximately monroe county, ny
            top_left_lat = 43.4,
            top_left_lng = -77.9,
            bottom_right_lat = 43,
            bottom_right_lng = -77.3,

            use_fence = True,
        )
        DBSession.add(assignment)
        
        questionassignment = QuestionAssignments(
            assignment_id = 1,
            question_id = 1,
        )
        DBSession.add(questionassignment)
        
        transaction.commit()


