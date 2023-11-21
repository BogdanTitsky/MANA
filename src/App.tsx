import { Routes, Route } from 'react-router-dom';

import SigninForm from './auth/forms/SigninForm';
import SignupForm from './auth/forms/SignupForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './root/pages';
import AuthLayout from './auth/AuthLayout';
import RootLayout from './root/RootLayout';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
    return (
        <main className="flex h-screen">
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SigninForm />} />
                    <Route path="/sign-up" element={<SignupForm />} />
                </Route>
                <Route element={<RootLayout />}>
                    <Route path="/profile/:id/*" element={<Profile />} />
                    <Route index element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/all-users" element={<AllUsers />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:id" element={<EditPost />} />
                    <Route path="/post/:id" element={<PostDetails />} />
                    <Route path="/update-profile/:id" element={<UpdateProfile />} />
                </Route>
            </Routes>
            <Toaster />
        </main>
    );
};

export default App;
