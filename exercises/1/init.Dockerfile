FROM node
COPY exercise.mjs /app/exercise.mjs

# This needs to be done on the submission level
# COPY submission.mjs /app/submission.mjs
# CMD node /app/exercise.mjs


# then GREP the output for the word "fail" or "error"