import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MerchantsTable } from 'src/sections/merchant/merchants-table';
import { MerchantsSearch } from 'src/sections/merchant/merchants-search';
import { applyPagination } from 'src/utils/apply-pagination';
import AddMerchantForm from '../sections/merchant/merchants-add'
import Divider from '@mui/material/Divider';


const now = new Date();

const useMerchants = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination([], page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useMerchantIds = (merchants) => {
  return useMemo(
    () => {
      return merchants.map((merchant) => merchant.id);
    },
    [merchants]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [merchantsData, setMerchantData] = useState(null);
  const [addFormEnabled, setAddFormEnabled] = useState(false);

  useEffect(() => {
    const getMerchantData = async () => {
//    let base64 = require('base-64')
    let username = 'vinothgopi'
    let password = 'password'
    let headers = new Headers()
    headers.append('Authorization', 'Basic dGVzdDpwYXNzd29yZA==')
      const response = await fetch('http://localhost:8080/api/v1/merchants', {
        method: "GET",
        headers: headers});
      const data = await response.json();
      console.log(data)
      setMerchantData(data);
    };

    getMerchantData();
  }, []);

  const merchants = useMerchants(page, rowsPerPage);
  const merchantIds = useMerchantIds(merchants);
  const merchantSelection = useSelection(merchantIds);

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
         Merchants
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
                  Merchants
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
                  onClick={() => setAddFormEnabled(!addFormEnabled)}
                >
                  Add
                </Button>
              </div>
            </Stack>
            {addFormEnabled && <AddMerchantForm/>} 
            <Divider />
            <MerchantsSearch />
            <MerchantsTable
              count={merchantsData==null ? 0 :merchantsData.length}
              items={merchantsData == null ? [] : merchantsData}
              onDeselectAll={merchantSelection.handleDeselectAll}
              onDeselectOne={merchantSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={merchantSelection.handleSelectAll}
              onSelectOne={merchantSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={merchantSelection.selected}
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
