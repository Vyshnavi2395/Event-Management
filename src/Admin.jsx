import React, { Component } from 'react';
import axios from 'axios';
import QrReader from 'react-qr-scanner';
import { Box, Center, Button, Text, Input, Stack } from '@chakra-ui/react';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 100,
            result: 'No result',
            referenceNumber: '',
            validationResult: null,
            checkedIn: false,
            checkInMessage: ''
        };

        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleManualVerification = this.handleManualVerification.bind(this);
        this.handleCheckIn = this.handleCheckIn.bind(this);
    }

    handleScan(data) {
        if (data && data.text) {
            console.log('Scanned QR code result:', data.text);
            this.setState({
                result: data.text,
            });
            this.validateReferenceNumber(data.text);
        }
    }

    handleError(err) {
        console.error(err);
    }

    handleManualVerification() {
        const { referenceNumber } = this.state;
        if (referenceNumber.trim() !== '') {
            this.validateReferenceNumber(referenceNumber.trim());
        } else {
            console.error('Reference number is empty');
            this.setState({ validationResult: { valid: false, error: 'Reference number cannot be empty' } });
        }
    }

    validateReferenceNumber(referenceNumber) {
        axios.get(`http://localhost:4000/api/validateReferenceNumber?ref=${referenceNumber}`)
            .then(response => {
                this.setState({ validationResult: response.data });
            })
            .catch(error => {
                console.error('Error validating reference number:', error);
                this.setState({ validationResult: { valid: false, error: 'Error validating reference number. Please try again later.' } });
            });
    }

    handleCheckIn() {
        const { referenceNumber, result } = this.state;
        let checkInReferenceNumber = '';

        if (result !== 'No result') {

            checkInReferenceNumber = result;
        } else {

            checkInReferenceNumber = referenceNumber;
        }

        console.log("Reference number for check-in is", checkInReferenceNumber);
        axios.post('http://localhost:4000/api/checkin', { referenceNumber: checkInReferenceNumber })
            .then(response => {
                console.log('Check-in successful:', response.data);
                this.setState({
                    checkedIn: true,
                    checkInMessage: 'Check-in successful!'
                });
            })
            .catch(error => {
                console.error('Error during check-in:', error);
                this.setState({
                    checkInMessage: error.response.data.message || 'Error during check-in. Please try again later.'
                });
            });

    }



    render() {
        const previewStyle = {
            height: 240,
            width: 320,
        };

        return (
            <Box>
                <Center>
                   <Box boxShadow={'base'} margin={'20'}>
                   <QrReader
                        delay={this.state.delay}
                        style={previewStyle}
                        onError={this.handleError}
                        onScan={this.handleScan}
                    />
                   </Box>
                </Center>
                <Center mt={4}>
                    <Text>Scanned Result: {this.state.result}</Text>
                </Center>
                <Center mt={4}>
                    <Stack>
                        <Input
                            placeholder="Enter reference number"
                            value={this.state.referenceNumber}
                            onChange={(e) => this.setState({ referenceNumber: e.target.value })}
                        />
                        <Button ml={4} colorScheme="blue" onClick={this.handleManualVerification}>Verify Manually</Button>
                    </Stack>
                </Center>
                {this.state.validationResult && (
                    <Box mt={4} textAlign="center">

                        {this.state.validationResult.valid ? (
                            <>
                                <Text color="green.500">Reference number is valid</Text>
                                {!this.state.checkedIn && (
                                    <Button mt={2} colorScheme="green" onClick={this.handleCheckIn}>Check-in</Button>
                                )}
                            </>
                        ) : (
                            <Text color="red.500">Reference number is invalid: {this.state.validationResult.error}</Text>
                        )}
                    </Box>
                )}
                {this.state.checkInMessage && (
                    <Box mt={4} textAlign="center">
                        <Text>{this.state.checkInMessage}</Text>
                    </Box>
                )}
            </Box>
        );
    }
}

export default Admin;
