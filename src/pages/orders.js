import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OrdersTable } from 'src/sections/orders/orders-table';
import { OrdersSearch } from 'src/sections/orders/orders-search';
import { applyPagination } from 'src/utils/apply-pagination';

const now = new Date();

const useOrders = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination([], page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useOrderIds = (orders) => {
  return useMemo(
    () => {
      return orders.map((orders) => orders.id);
    },
    [orders]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const getOrderData = async () => {
      const response = await fetch('http://localhost:8080/api/v1/orders', {
        method: "GET"});
      const data = await response.json();
      console.log(data)
      setOrderData(data);
    };

    getOrderData();
  }, []);

  const orders = useOrders(page, rowsPerPage);
  const orderIds = useOrderIds(orders);
  const ordersSelection = useSelection(orderIds);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
         Orders
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Orders
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <OrdersSearch />
            <OrdersTable
              count={orderData==null ? 0 :orderData.length}
              items={orderData == null ? [] : orderData}
              onDeselectAll={ordersSelection.handleDeselectAll}
              onDeselectOne={ordersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={ordersSelection.handleSelectAll}
              onSelectOne={ordersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={ordersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
