import React, { useState } from "react";
import { fetcher } from "../components/fetcher";
import { Meta } from "../components/Meta";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import {
  Container,
  Input,
  Button,
  Box,
  HStack,
} from "@chakra-ui/react";


const download = () => {
  const [code, setCode] = useState("");
  const [res, setRes] = useState();
  const fetchData = async (mycode) => {
    try {
      const response = await fetcher(`downloadfile/${mycode}/`);
      setRes(response.data);
    } catch (error) {
      setRes(error);
    }
  };


  
  const handleForm = (e) => {
    e.preventDefault();

    fetchData(code);
    setCode("");
  };
  

  

  
  console.log(res?.data?.file);

  return (
    <>
      <Meta title="SendAnywhere | Download" />
      <Navbar />

      <Container
        as="section"
        h="90vh"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box w="96" rounded="lg" shadow="2xl" p="5">
          <form onSubmit={handleForm}>
            <HStack>
              <Input
                type="text"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength="6"
                required
                placeholder="code"
              />
              <Button type="submit" width="full" colorScheme="pink" mt="2">
                Submit
              </Button>
            </HStack>
            {res?.status ? (
              <a
                //href={`${process.env.NEXT_PUBLIC_MEDIA_API}${res?.data?.file} `}
                href='/vercel.svg'
                target="_blank" rel="noopener noreferrer"
                download
              >
                <Button variant="ghost" bgColor="pink.100" mt="2" width="100%">
                  Download
                </Button>
              </a>
            ) : (
              ""
            )}
          </form>
          <Link href="/">
            <Button w="100%" mt="2" >Upload File</Button>
          </Link>
        </Box>
      </Container>

      <Link href="/">Upload</Link>
    </>
  );
};

export default download;
