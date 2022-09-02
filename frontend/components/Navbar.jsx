import { Heading, HStack } from '@chakra-ui/react'

export const Navbar = () => {
  return (
    <>
      <HStack  as="nav" bgColor="red.600" p="4" justifyContent="center">
        <Heading color="white" >SendAnywhere</Heading>
      </HStack>
    </>
  )
}
