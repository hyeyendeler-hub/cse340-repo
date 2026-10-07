import bcrypt from 'bcrypt';
import {
    createUser,
    authenticateUser,
    getUsers
} from '../models/users.js';
import { getVolunteerProjects } from '../models/volunteers.js';

const showUserRegistrationForm = async (req, res) => {
    res.render('register', {
        title: 'Register'
    });

};

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            req.session.user = user;

            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            return res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash(
            'error',
            'An error occurred during login. Please try again.'
        );
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error during logout:', error);
        }

        res.redirect('/login');
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser({
            ...req.body,
            password: hashedPassword
        });

        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/register');
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in to continue.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/');
    }

    next();
};

const showUsers = async (req, res, next) => {
    try {
        const users = await getUsers();

        res.render('users', {
            title: 'Users',
            users
        });
    } catch (error) {
        console.error('Error loading users:', error);
        next(error);
    }
};

const showDashboard = async (req, res, next) => {
    try {
        const volunteerProjects = await getVolunteerProjects(
            req.session.user.user_id
        );

        res.render('dashboard', {
            title: 'Dashboard',
            name: req.session.user.name,
            email: req.session.user.email,
            volunteerProjects
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        next(error);
    }
};


export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
};