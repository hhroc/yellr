# Yellr Moderator

###Admin APIs

- admin/get_access_token.json
- admin/get_posts.json
- admin/create_question.json
- admin/publish_assignment.json
- admin/update_assignment.json
- admin/create_message.json
- admin/get_languages.json
- admin/get_question_types.json
- admin/create_user.json
- admin/get_assignment_responses.json
- admin/publish_story.json
- admin/create_collection.json
- admin/disable_collection.json
- admin/add_post_to_collection.json
- admin/remove_post_from_collection.json
- admin/get_collection_posts.json



Expected Flow:
[start from a brand new Admin user]

CREATING ASSIGNMENT
-   creates an Assignment
        ** admin/create_question.json
    multi-lingual (english and spanish)
    wants any type of response back (free_text)
    adds deadline
        ** admin/publish_assignment.json
-   a Collection is created
        ** admin/create_collection.json
    (a collection is created automatically after creating an assignment)
    (typicall of the same name)
-   user is taken to the Assignment page
    there they see the Assignment question they posted
    they can edit the Assignment from here
        ** admin/update_assignment.json
    they can see all responses directly to their Assignment
        ** admin/get_assignment_responses.json
    they also see the Collection associated with the Assignment
        ** admin/get_collection_posts.json
    ----------------------------
    IMPORTANT DISTINCTION:
        When you view an Assignment page, you're looking at that assignment's "hub"
        Everything related to that assignment can be accessed from this page
        There are two main feeds that are of particular interest to Users
        Assignment Responses & Collection posts
    DIFFERENCE:
        Assignment responses - are the raw submissions that still require some moderation
        Collection posts - are the ones that have been approved, ie meet the user's criteria
    WHY:
        Being able to view a Collection by itself is less distracting.
        It allows the user to review the best content their Assignment has generated.
        By viewing the submitted content by itself, they can decide if they are ready to create a story or not
    ----------------------------


admin/add_post_to_collection.json
Used when viewing things in the Yellr raw feed


admin/disable_collection.json
admin/remove_post_from_collection.json

