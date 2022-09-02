import { useEffect, useState } from "react";
import { Meta } from "../components/Meta";
import { fetcher } from "../components/fetcher";
import { Navbar } from "../components/Navbar";
import {
  Container,
  Input,
  Button,
  Box,
  IconButton,
  Heading,
  HStack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { BiClipboard } from "react-icons/bi";
import { BsClipboardCheck } from "react-icons/bs";
var fileDownload = require("js-file-download");

const generateCode = () => {
  const arr = [];
  const min = 65;
  const max = 90;
  for (let index = 0; index < 6; index++) {
    arr.push(
      String.fromCharCode(Math.floor(Math.random() * (max - min)) + min)
    );
  }

  const value = arr.join("");
  return value;
};

export default function Home() {
  const [file, setFile] = useState();
  const [code, setCode] = useState();
  const [res, setRes] = useState();
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const { onCopy, hasCopied } = useClipboard(code);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const [downloadCode, setDownloadCode] = useState();
  const toast = useToast();

  const sendData = async (formData) => {
    try {
      setLoading(true);
      const response = await fetcher.post("uploadfile/", formData);
      setRes(response.data);
    } catch (error) {
      setRes(error);
    } finally {
      setLoading(false);
    }
  };

  const deletecode = async (c) => {
    try {
      const response = await fetcher.delete(`deletefile/${c}/`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (start) {
      setTimeout(() => {
        deletecode(code);
        setStart(false);
        setCode("");
        console.log("code deleted from server");
      }, [25000]);
    }
  }, [start]);

  const handleForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const genCode = generateCode();
    console.log(genCode);
    formData.append("file", file);
    formData.append("code", genCode);
    setStart(true);
    sendData(formData);
    setCode(genCode);
  };
  console.log(code);

  const fetchData = async (mycode) => {
    try {
      const { data } = await fetcher(`downloadfile/${mycode}/`);
      fileDownload("data", `/${data.data.file}`);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    fetchData(downloadCode);
    setDownloadStatus(true);
    setDownloadCode("");
  };

  return (
    <>
      <Meta />
      <Navbar />

      <Container
        as="main"
        minW="100%"
        minH="100vh"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={{ base: "", md: "space-around" }}
        alignItems="center"
        gap="10"
        px="10"
      >
        <Box
          as="section"
          w="96"
          rounded="xl"
          shadow="2xl"
          h="64"
          bg="white"
          p="5"
          display="flex"
          flexDir="column"
          alignItems="start"
          justifyContent="start"
        >
          <Heading mb="10" size="lg" color="red.600">
            Upload data
          </Heading>

          <form onSubmit={handleForm}>
            <Input
              type="file"
              accept="image/*, video/*"
              p="2"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <Button
              isDisabled={start}
              type="submit"
              variant="solid"
              colorScheme="red"
              width="full"
              mt="2"
              onClick={() =>
                toast({
                  title: "File uploaded successfully ",
                  description:"After 1 min , file will be removed from server",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  position: "top",
                  variant: "left-accent",
                })
              }
            >
              Upload
            </Button>
            <HStack w="full" bgColor="red.50" rounded="lg" mt="3" p="1">
              <Input
                border="none"
                outline="none"
                value={code}
                readOnly
                fontWeight="bold"
              />
              <IconButton colorScheme="red" onClick={onCopy}>
                {!hasCopied ? <BiClipboard /> : <BsClipboardCheck />}
              </IconButton>
            </HStack>
          </form>
        </Box>
        <Box
          as="section"
          w="96"
          rounded="xl"
          shadow="2xl"
          h="64"
          bg="white"
          p="5"
        >
          <Heading mb="10" size="lg" color="red.600">
            Download data
          </Heading>

          <form onSubmit={handleDownload}>
            <Input
              type="text"
              name="code"
              value={downloadCode}
              onChange={(e) => setDownloadCode(e.target.value)}
              maxLength="6"
              required
              placeholder="Code"
              bg="red.50"
              color="red.600"
              fontWeight="bold"
              _placeholder={{ color: "red.800" }}
              borderColor="red.700"
              outline="none"
            />
            <Button
              type="submit"
              variant="solid"
              colorScheme="red"
              width="full"
              mt="2"
              onClick={()=>toast({
                title: 'file downloaded successfully',
                status: 'success',
                duration: 9000,
                isClosable: true,
                variant:'left-accent',
                position:'top'
              })}
            >
              Download
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
}
