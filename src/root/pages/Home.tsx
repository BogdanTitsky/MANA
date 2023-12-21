import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import UserCard from '@/components/shared/UserCard';
import { Button } from '@/components/ui/button';
import { useGetFirstUsers, useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';

const Home = () => {
  const { data: posts, isPending: isPostsLoading } = useGetRecentPosts();
  const { data: users, isFetching: isUserLoading } = useGetFirstUsers();

  if (!users) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

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

          <Link to={'/explore'}>
            <Button type="button" size="lg" className="shad-button_primary px-12 ">
              Search more
            </Button>
          </Link>
        </div>
      </div>
      <div className="right-side">
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
      </div>
    </div>
  );
};

export default Home;
