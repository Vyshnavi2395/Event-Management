import { Button, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const Card = ({ amount, img, checkoutHandler }) => {
    return (
        <VStack
            spacing={4}
            alignItems="center"
            width={['90%', '80%', '70%', '60%']} 
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
            boxShadow="md"
        >
            <Image src={img} boxSize={64} width={'fit-content'} objectFit="cover" borderRadius="md" />
            <Text fontSize="xl" fontWeight="bold">Hindi Club Pass</Text>
            <Text fontSize="lg">₹{amount}</Text>
            <Text fontSize="md">Enjoy exclusive access to Hindi Club events and activities!</Text>
            <Text fontSize="sm" textAlign="center">Valid for one year from purchase date.</Text>
            <Button colorScheme="blue" onClick={() => checkoutHandler(amount)}>Buy Now</Button>
        </VStack>
    )
}

export default Card;
