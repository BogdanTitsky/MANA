import { bottombarLinks } from '@/constants';
import { INavLink } from '@/types';
import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const Bottombar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (
        <section className="bottom-bar">
            {bottombarLinks.map((link: INavLink) => {
                const isActive = pathname === link.route;
                return (
                    <Link
                        to={link.route}
                        key={link.label}
                        className={`group flex-center flex-col px-5 py-2 transition rounded-[10px] ${
                            isActive && 'bg-primary-500 '
                        }`}
                    >
                        <img
                            src={link.imgURL}
                            alt={link.label}
                            className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                        />
                        <p className="tiny-medium text-light-2">{link.label}</p>
                    </Link>
                );
            })}
        </section>
    );
};

export default Bottombar;
