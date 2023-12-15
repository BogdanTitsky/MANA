import Loader from '@/components/shared/Loader';
import { useToast } from '@/components/ui/use-toast';
import { useGetInfiniteUsers } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import UserCard from '@/components/shared/UserCard';

const AllUsers = () => {
  const { toast } = useToast();

  const { ref, inView } = useInView();

  const {
    data: users,
    fetchNextPage,
    hasNextPage,
    isFetching: isUserLoading,
    isError: isErrorUsers,
  } = useGetInfiniteUsers();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (isErrorUsers) {
    toast({ title: 'Something went wrong.' });

    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isUserLoading && !users ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {users?.pages.map((page) =>
              page?.documents.map((user) => (
                <li key={`user${user.$id}`} className="flex-1 min-w-[200px] w-full">
                  <UserCard user={user} />
                </li>
              ))
            )}
          </ul>
        )}
        {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
