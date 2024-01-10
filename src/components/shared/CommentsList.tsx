import { Models } from 'appwrite';

type CommentsListProps = {
  commentsList: Models.Document[];
};

const CommentsList = ({ commentsList }: CommentsListProps) => {
  console.log(commentsList);

  return (
    <ul className="flex flex-col gap-5 mb-8 max-h-72 overflow-y-auto custom-scrollbar">
      {commentsList.map((comment) => (
        <li key={comment.$id}>
          <div className="flex gap-3">
            <img
              className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
              src={comment.creator.imageUrl}
              alt="commentator"
            />
            <div className="bg-dark-4 p-3 rounded">
              <p className="text-light-3">{comment.creator.name}</p>
              <p>{comment.comment}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentsList;
