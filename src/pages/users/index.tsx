import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Checkbox,
  useBreakpointValue,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { RiAddLine, RiCloseCircleFill } from "react-icons/ri";
import { useQuery } from "react-query";

import dateformat, { i18n } from "dateformat";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { AuthContext } from "../../contexts/AuthContext";

export default function UserList() {
  const [page, setPage] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { refresh } = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  const [selected, setSelected] = useState([]);

  i18n.dayNames = [
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb",
    "Dom",
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  i18n.monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  async function getUsers() {
    await api.get("/user/users").then((res) => {
      setUsers(res.data.docs);
    });
  }

  useEffect(() => {
    getUsers();
  }, [refresh]);

  const toast = useToast();

  async function deleteUser(id) {
    await api
      .delete(`/user/${id}`)
      .then(() => {
        toast({
          title: "Deletado com sucesso",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
      })
      .finally(() => {
        getUsers();
      });
  }

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Box>
      <Header />

      <Flex w="100%" my={["6"]} maxWidth={1480} mx="auto" px={["6"]}>
        <Box flex="1" borderRadius={8} bg="#eee" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" color="#333" fontWeight="normal">
              Usuários
            </Heading>

            <Flex>
              {selected.length > 0 && (
                <Button
                  onClick={() => {
                    selected.map((s, i) => {
                      deleteUser(s);
                    });
                  }}
                  cursor="pointer"
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="pink"
                  leftIcon={<Icon as={RiCloseCircleFill} fontSize="20" />}
                >
                  Deletar {selected.length}
                </Button>
              )}
            </Flex>
          </Flex>

          {!users ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Data de Cadastro</Th>}
                    <Th width="8"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user, i) => {
                    return (
                      <Tr key={i}>
                        <Td px={["6"]}>
                          <Checkbox
                            colorScheme="pink"
                            onChange={(e) => {
                              if (selected.includes(user._id)) {
                                let filtered = selected.filter(
                                  (i) => i === user._ud
                                );
                                setSelected([...selected, filtered]);
                              } else {
                                setSelected([...selected, user._id]);
                              }
                            }}
                          />
                        </Td>
                        <Td>
                          <Box>
                            <Text fontWeight="bold" color="#333">
                              {user.name}
                            </Text>
                            <Text fontSize="sm" color="gray.300">
                              {user.email}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && (
                          <Td color="#333">
                            {dateformat(
                              user.createdAt,
                              "ddd dd mmm yyyy HH:MM:ss"
                            )}
                          </Td>
                        )}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>

              {/* <Pagination
                totalCountOfRegisters={data.length}
                currentPage={page}
                onPageChange={setPage}
              /> */}
            </>
          )}
        </Box>
      </Flex>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md" fontWeight="bold" color="#333">
            <Text fontSize="2xl" fontWeight="bold" color="#000">
              Você tem certeza?
            </Text>
            <Text fontSize="md" color="#333">
              Sua ação será irreversivel
            </Text>
          </ModalHeader>
          <ModalCloseButton bg="#eee" color="#333" />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                selected.map((s, i) => {
                  deleteUser(s);
                });
                onClose();
                setSelected([]);
              }}
              bg="tomato"
              color="#FFF"
            >
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
