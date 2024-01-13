import GridPostList from '@/components/shared/GridPostList';
import LikedPosts from '@/components/shared/LikedPosts';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useFollowUser, useGetUserById } from '@/lib/react-query/queriesAndMutations';
import { checkIsFollowed } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUserProfile } = useGetUserById(id || '');
  const { data: currentAuthUser } = useGetUserById(user.id || '');
  const [followers, setFollowers] = useState<string[]>([]);

  useEffect(() => {
    if (currentUserProfile && currentAuthUser) {
      setFollowers(currentUserProfile.followers);
    }
  }, [currentUserProfile, currentAuthUser]);

  const { mutate: followUser, isPending: isPendingToFollow } = useFollowUser();

  if (!currentUserProfile || !currentAuthUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const handleFollowUser = (e: React.MouseEvent) => {
    e.stopPropagation();

    //newFollowersList
    let newFollowers = [...followers];
    const alreadyFollowed = newFollowers.includes(currentAuthUser.$id);

    //check should follow or unfollow

    if (alreadyFollowed) {
      newFollowers = newFollowers.filter((item) => item !== user.id);
    } else {
      newFollowers.push(currentAuthUser.$id);
    }
    setFollowers(newFollowers);

    //newFollowingList
    let newFollowing = [...currentAuthUser.following];
    const isAlreadyFollowing = newFollowing.includes(id);
    //check should become a follower or unfollow
    if (isAlreadyFollowing) {
      newFollowing = newFollowing.filter((item) => item !== id);
    } else {
      newFollowing.push(id);
    }

    followUser({
      followers: newFollowers,
      following: newFollowing,
      forWhomfollowingId: id || '',
      followerId: user.id,
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUserProfile.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUserProfile.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUserProfile.username}
              </p>
              <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                <StatBlock value={currentUserProfile.posts.length} label="Posts" />
                <StatBlock value={followers.length} label="Followers" />
                <StatBlock value={currentUserProfile.following.length} label="Following" />
              </div>
              <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                {currentUserProfile.bio}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUserProfile.$id && 'hidden'}`}>
              <Link
                to={`/update-profile/${currentUserProfile.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUserProfile.$id && 'hidden'
                }`}
              >
                <img src={'/assets/icons/edit.svg'} alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
              </Link>
            </div>
            <div className={`${user.id === id && 'hidden'}`}>
              <Button
                type="button"
                className="shad-button_primary px-8"
                onClick={handleFollowUser}
                disabled={isPendingToFollow}
              >
                {isPendingToFollow ? (
                  <Loader />
                ) : checkIsFollowed([...followers], user.id) ? (
                  'Unfollow'
                ) : (
                  'Follow'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {currentUserProfile.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && '!bg-dark-3'}`}
          >
            <img src={'/assets/icons/posts.svg'} alt="posts" width={20} height={20} />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && '!bg-dark-3'
            }`}
          >
            <img src={'/assets/icons/like.svg'} alt="like" width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )}
      <Routes>
        <Route index element={<GridPostList posts={currentUserProfile.posts} showUser={false} />} />
        {currentUserProfile.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
