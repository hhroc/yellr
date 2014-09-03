# Yellr Moderator


- Scenarios


## Scenarios

Elvis Crespo is a reporter at WXXI. He is working on a story on how people vote in the city.
He uses the Yellr admin to gather feedback directly from people in the community by posting a question. He posts the question in English and Spanish so he can reach out to the larger Hispanic community.

He posts a question that says "Are you planning on voting in this upcoming election?".
The answer is a simple yes or no but he receives video replies explaining why they will or won't be. He also recieves some text responses along the same lines. Elvis receives a few responses but nothing too substantial comes up. He posts a follow-up "Let us know what your election experience is like!", which generates much more content.

He logs in the next day and sees that he has some more replies waiting for him from election night. He goes through all the responses and saves the ones he thinks has potential.

Every once in a while he makes sure to check the Yellr raw feed where all the latest content can be viewed. It's not uncommon for users to submit content without having it associated with an assignment. When Elvis sees a post that is related to the electoral race in the city he makes sure to save it to a collection.

At the end of 2 weeks (the default length of time) he reviews all the content that had been submitted and saved to the Assignment's collection. He exports the content and saves the [zip] file to his desktop (which automatically notifies the content submitters) for his sake.

He prepares to write an article which he'll post to the Yellr community. He uses the text editor within the Admin since it allows easy access to all the media he had saved. Once in a while he'll post via file submission of the markdown text and all the media files associated with it.




### Admin APIs

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

