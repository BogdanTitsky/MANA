import { useGetUserById } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();

  const { data: currentUser } = useGetUserById(id || '');
  console.log(currentUser);

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
