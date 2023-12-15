import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import UserCard from '@/components/shared/UserCard';
import {
  useGetFirstUsers,
  useGetInfiniteUsers,
  useGetRecentPosts,
} from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  // const { ref, inView } = useInView();

  const { data: posts, isPending: isPostsLoading, isError: isErrorPosts } = useGetRecentPosts();
  const { data: users, isFetching: isUserLoading } = useGetFirstUsers();

  // useEffect(() => {
  //   if (inView) fetchNextPage();
  // }, [inView]);

  if (!users) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  // console.log(users);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostsLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !users ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {users.documents.map((item, index) => (
              <li key={`page-${index}`}>
                <UserCard user={item} />
              </li>
            ))}
          </ul>
        )}
        {/* {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Home;
