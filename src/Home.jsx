import React, { useState } from 'react';
import { Box, Stack, Button, FormControl, FormLabel, Input, Select, FormErrorMessage, useToast } from "@chakra-ui/react";
import axios from "axios";
import Card from './Card';

const Home = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        phoneNumber: '',
        referralCode: '',
        batch: '2021'
    });
    const [emailError, setEmailError] = useState('');
    const [userDetailsFilled, setUserDetailsFilled] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        });

        // Validate email
        if (name === 'email') {
            const isValid = validateEmail(value);
            setEmailError(isValid ? '' : 'Email must end with @vitbhopal.ac.in');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserDetailsFilled(true);
    };

    const handlePayNow = async () => {
        try {
           
            const amount = 100;
            const { data: { key } } = await axios.get("http://www.localhost:4000/api/getkey");

            const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
                amount,
                userDetails
            });

            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Hindi Club Vit Bhopal",
                description: "Tutorial of RazorPay",
                image: "https://github.com/Ravi2021gh/email_templet_hindi_club/blob/main/images/hindi_club%20logo%204.png?raw=true",
                order_id: order.id,
                callback_url: "http://localhost:4000/api/paymentverification",
                prefill: {
                    name: userDetails.name,
                    email: userDetails.email,
                    contact: userDetails.phoneNumber,
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#121212"
                }
            };

            const razor = new window.Razorpay(options);
            razor.open();

          
            await registerUser();

           
            toast({
                title: 'Registration successful',
                description: 'You have been successfully registered and payment has been processed.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            
            toast({
                title: 'Error',
                description: 'An error occurred while processing your payment.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const registerUser = async () => {
        try {
            
            await axios.post("http://localhost:4000/api/register", userDetails);
        } catch (error) {
            console.error('Error registering user:', error);
            
            toast({
                title: 'Error',
                description: 'An error occurred while registering the user.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const validateEmail = (email) => {
        return email.endsWith('@vitbhopal.ac.in');
    };

    return (
        <Box>
            {!userDetailsFilled ? (
                <Stack spacing={4} align="stretch">
                    <form onSubmit={handleSubmit}>
                        <FormControl id="name">
                            <FormLabel>Name:</FormLabel>
                            <Input type="text" name="name" value={userDetails.name} onChange={handleChange} required />
                        </FormControl>

                        <FormControl id="email" isInvalid={emailError}>
                            <FormLabel>Email ID:</FormLabel>
                            <Input type="email" name="email" value={userDetails.email} onChange={handleChange} required />
                            <FormErrorMessage>{emailError}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="registrationNumber">
                            <FormLabel>Registration Number:</FormLabel>
                            <Input type="text" name="registrationNumber" value={userDetails.registrationNumber} onChange={handleChange} required />
                        </FormControl>

                        <FormControl id="phoneNumber">
                            <FormLabel>Phone Number:</FormLabel>
                            <Input type="text" name="phoneNumber" value={userDetails.phoneNumber} onChange={handleChange} required />
                        </FormControl>

                        <FormControl id="referralCode">
                            <FormLabel>Referral Code:</FormLabel>
                            <Input type="text" name="referralCode" value={userDetails.referralCode} onChange={handleChange} />
                        </FormControl>

                        <FormControl id="batch">
                            <FormLabel>Batch:</FormLabel>
                            <Select name="batch" value={userDetails.batch} onChange={handleChange}>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                            </Select>
                        </FormControl>

                        <Button type="submit" colorScheme="blue">Submit</Button>
                    </form>
                </Stack>
            ) : (
                <Stack h={"100vh"} alignItems="center" justifyContent="center">
                    <Card amount={100} img={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBS7Z4gRbwpNeTIk4MaQz4ZMCatT6uTeSh7g&s"} checkoutHandler={handlePayNow}></Card>

                </Stack>
            )}
        </Box>
    );
};

export default Home;
