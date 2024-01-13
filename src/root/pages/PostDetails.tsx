import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/PostStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import {
  useCreateComment,
  useDeletePost,
  useGetPostById,
} from '@/lib/react-query/queriesAndMutations';
import { multiFormatDateString } from '@/lib/utils';
import { commentSchema } from '@/lib/validation';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CommentsList from '@/components/shared/CommentsList';
import { INewComment } from '@/types';

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();

  const { mutate: createComment } = useCreateComment();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: '',
    },
  });

  function onSubmit(values: z.infer<typeof commentSchema>) {
    const comment: INewComment = {
      userId: user.id,
      postId: id || '',
      commentsText: values.comment,
    };

    createComment(comment);

    form.reset({
      comment: '',
    });
  }

  const { mutate: deletePost } = useDeletePost();
  const handleDeletePost = () => {
    deletePost({ postId: id || '', imageId: post?.imageId });
    navigate(-1);
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full gap-2">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:h-16 lg:w-16"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                  <div className="flex-center gap-2 text-light-3 ">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt || '')}
                    </p>
                    -<p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-3">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`post_details-edit_btn ${user.id !== post?.creator.$id && 'hidden'} `}
                >
                  <img src="/assets/icons/edit.svg" width={24} height={24} alt="edit" />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`post_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                </Button>
              </div>
            </div>
            <div className="flex w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 ml-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="w-full">
              <div>
                <CommentsList commentsList={post?.comments} />
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full  flex gap-3">
                  <img
                    src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                    alt="creator"
                    className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
                  />
                  <div className="relative w-full">
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Write your comment..."
                              {...field}
                              className="shad-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="absolute right-0 top-1/2 -translate-y-1/2 " type="submit">
                      <img src="/assets/icons/send.svg" alt="send" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
