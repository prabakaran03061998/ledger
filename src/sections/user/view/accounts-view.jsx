import { useState, useEffect, forwardRef, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Dialog, Checkbox, TextField, DialogTitle, Autocomplete, DialogActions, DialogContent, FormControlLabel, DialogContentText, } from '@mui/material';

import useApiService from 'src/services/api_services';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

export default function UserPage() {

  const { showSnackbar } = useSnackbar();

  const { createAcc, getAccount, updateAcc } = useApiService();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [createAccount, setCreateAccount] = useState({ "id": 0, "title": "", "use": "", "description": "", "status": true });

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [load, setLoad] = useState(true);

  const getAccountDetails = useCallback(async () => {
    const response = await getAccount();
    console.log('res', response);
    setAccountData(response);
    setLoad(false);
  }, [getAccount]);

  console.log('list', accountData);


  useEffect(() => {
    if (load) {
      getAccountDetails();
    }
  }, [load, getAccountDetails])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setCreateAccount({ "id": 0, "title": "", "use": "", "description": "", "status": false });
  };

  const top100Films = [
    { label: 'Business Expences', id: 1 },
    { label: 'Home Expences', id: 2 },
    { label: 'Room Expences', id: 3 },
    { label: 'My Personal Expences', id: 4 },
    { label: 'Store Expences', id: 5 },
  ];

  const saveAccount = async () => {
    const response = await createAcc(createAccount);
    if (response.status === "OK") {
      console.log(response);
      showSnackbar(response.message, 'success');
      getAccountDetails();
    }
  }

  const updateAccount = async () => {
    const response = await updateAcc(createAccount);
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
      getAccountDetails();
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateAccount((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = accountData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleEdit = (row) => {
    setEdit(true);
    setCreateAccount({ "id": row.id, "title": row.title, "use": row.use, "description": row.description, "status": row.status });
    setOpen(true);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: accountData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Card>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0} paddingLeft={2} paddingRight={2} paddingTop={2}>
          <Typography variant="h4">Accounts</Typography>

          <Button variant="contained" color="inherit" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Create Account
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                if (edit) {
                  updateAccount();
                } else {
                  saveAccount();
                }
                handleClose();
              },
            }}
          >
            <DialogTitle>{edit ? 'Update Account' : 'Create Account'}</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <DialogContentText>
                  This is the ledger maintaining account. Please fill in the following details to create an account.
                </DialogContentText>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="title"
                  onChange={handleChange}
                  name="title"
                  value={createAccount.title}
                  label="Title"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
                <Autocomplete
                  options={top100Films}
                  fullWidth
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  inputValue={createAccount.use}
                  inputMode='text'
                  onChange={(event, value) => {
                    setCreateAccount((prevState) => ({
                      ...prevState,
                      'use': value.label
                    }));
                  }} ListboxProps={
                    {
                      style: {
                        maxHeight: '150px',
                        border: '2px solid blue',
                        borderRadius: '10px'
                      }
                    }
                  }
                  renderInput={(params) => <TextField  {...params} label="Use"
                    margin="dense"
                    id="use"
                    name="use"
                    variant='outlined'
                  />}
                />
                <TextField
                  required
                  margin="dense"
                  id="description"
                  maxRows={5}
                  minRows={3}
                  value={createAccount.description}
                  multiline
                  onChange={handleChange}
                  name="description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
                {edit ?
                  <FormControlLabel control={<Checkbox
                    defaultChecked={createAccount.status}
                    onChange={(event, value) => {
                      console.log('value', value);
                      setCreateAccount((prevState) => ({
                        ...prevState,
                        'status': value
                      }));
                    }} name="status" id="status" />}
                    label="Status (Active/Inactive)"

                  />
                  : null}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button type="submit" color='primary'>{edit ? 'Update' : 'Create'}</Button>
            </DialogActions>
          </Dialog>
        </Stack>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={accountData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: '', label: 'S.no' },
                  { id: 'title', label: 'Title' },
                  { id: 'balance', label: 'Balance' },
                  { id: 'description', label: 'Description' },
                  { id: 'status', label: 'Status', align: 'center' },
                  { id: '', label: 'Action', align: 'center' }
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <UserTableRow
                      key={row.id}
                      sno={index + 1}
                      title={row.title}
                      amount={row.balance}
                      description={row.description}
                      status={row.status}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      handleEdit={() => handleEdit(row)}

                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, accountData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={accountData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
