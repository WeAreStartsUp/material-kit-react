import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ItemsTable } from 'src/sections/item/items-table';
import { ItemSearch } from 'src/sections/item/items-search';
import { applyPagination } from 'src/utils/apply-pagination';
import AddItemForm from '../sections/item/items-add'
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

  const downloadTemplate = async () => {
    fetch('http://localhost:8080/api/v1/items/template', {
      method: "GET"}).then((response) => response.blob())
      .then((blob) => {
       
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `template.xlsx`);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  }

  useEffect(() => {
    const getMerchantData = async () => {
      const response = await fetch('http://localhost:8080/api/v1/items', {
        method: "GET"});
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
         Items
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
                  Items
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
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                    onClick={downloadTemplate}
                  >
                    Download Template
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
                  onClick={() => setAddFormEnabled(!addFormEnabled)}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <ItemSearch />
            {addFormEnabled && <AddItemForm />}
            <ItemsTable
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
