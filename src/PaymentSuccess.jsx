import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { useSearchParams } from "react-router-dom";
import jsPDF from 'jspdf'; 
import QRCode from 'qrcode.react';

const PaymentSuccess = () => {
    const searchQuery = useSearchParams()[0];
    const referenceNum = searchQuery.get("reference");

    const [qrCodeData, setQRCodeData] = useState('');

    useEffect(() => {
        setQRCodeData(referenceNum);
    }, [referenceNum]);

    // Event details
    const eventDetails = {
        name: "Utsahotsav - A Celebration of Hindi Culture",
        date: "24.02.2024",
        location: "MPH",
        ticketType: "Allowed to join Utsahotsav",
    };



    const handleDownloadTicket = () => {
        const pdf = new jsPDF(); 

        
        pdf.text("Event: " + eventDetails.name, 10, 10);
        pdf.text("Date: " + eventDetails.date, 10, 20);
        pdf.text("Location: " + eventDetails.location, 10, 30);
        pdf.text("Ticket Type: " + eventDetails.ticketType, 10, 40);
        pdf.text("Reference No.: " + referenceNum, 10, 50);

      
        const qrCodeCanvas = document.getElementById('qrcode');
        const qrCodeUrl = qrCodeCanvas.toDataURL('image/png');
        pdf.addImage(qrCodeUrl, 'PNG', 10, 60, 50, 50);

        pdf.save('event_ticket.pdf'); 
    };

    return (
        <Box>
            <VStack h="100vh" justifyContent={"center"} textAlign="center">
                <Heading textTransform={"uppercase"}>Order Successful</Heading>
                <Text fontSize="xl" mt={4}>
                    Thank you for your purchase! Here is your event pass:
                </Text>
                <Box borderWidth="1px" borderRadius="md" p={4} mt={4} id="event-ticket">
                    <Text fontSize="lg">Event: {eventDetails.name}</Text>
                    <Text fontSize="lg">Date: {eventDetails.date}</Text>
                    <Text fontSize="lg">Location: {eventDetails.location}</Text>
                    <Text fontSize="lg">Ticket Type: {eventDetails.ticketType}</Text>
                    <Text mt={4}>Reference No.: {referenceNum}</Text>
                    <Box visibility={'hidden'}>
                        <QRCode id="qrcode" value={qrCodeData} />
                    </Box>
                </Box>
                <Button colorScheme="blue" mt={4} onClick={handleDownloadTicket}>Download Event Pass</Button>

            </VStack>
        </Box>
    );
};

export default PaymentSuccess;
