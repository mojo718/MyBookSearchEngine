import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
    // Initial form state for user input
    const [userFormData, setUserFormData] = useState({ email: '', password: '' });
    // State for form validation, initially set to false
    const [validated, setValidated] = useState(false);
    // State for controlling the display of the alert
    const [showAlert, setShowAlert] = useState(false);
    // Mutation to login user using Apollo Client
    const [login] = useMutation(LOGIN_USER);

    // Handle changes to form inputs
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    // Handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Check if form is valid (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);

        console.log(userFormData);

        try {
            // Attempt to login the user with provided data
            const { data } = await login({
                variables: { ...userFormData },
            });

            // Authenticate the user with the received token
            Auth.login(data.login.token);

        } catch (err) {
            // Handle errors and display alert
            console.error(err);
            setShowAlert(true);
        }

        // Reset the form data after submission
        setUserFormData({
            email: '',
            password: '',
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Something went wrong with your login credentials!
                </Alert>
                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Your email'
                        name='email'
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Your password'
                        name='password'
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.email && userFormData.password)}
                    type='submit'
                    variant='success'>
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default LoginForm;
