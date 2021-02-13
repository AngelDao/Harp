import React from "react";
import { DescContainer, HR, Desc } from "./styles";
import { Table, Tbody, Tr, Td } from "@chakra-ui/react";

const Details = () => {
  return (
    <DescContainer>
      <HR />
      <Desc>
        <Table variant="unstyled" size="sm">
          <Tbody>
            <Tr>
              <Td>Collateral</Td>
              <Td>The ETH you deposit to make LUSD loans</Td>
            </Tr>
            <Tr>
              <Td>Debt</Td>
              <Td>The LUSD you have borrowed from Liquity</Td>
            </Tr>
            <Tr>
              <Td>Collateral Ratio</Td>
              <Td>
                Your Debt:Collateral ratio. If this falls below 110%, your
                collateral can be liquidated.
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Desc>
      <HR />
    </DescContainer>
  );
};

export default Details;
