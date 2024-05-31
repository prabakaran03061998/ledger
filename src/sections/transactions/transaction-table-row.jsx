import { useState } from 'react';
import PropTypes from 'prop-types';

// import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
    selected,
    title,
    tid,
    tDate,
    amount,
    type,
    sno,
    handleClick,
}) {
    const [open, setOpen] = useState(null);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    return (
        <>
            <TableRow>
                {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}

                <TableCell size='small' >{sno}</TableCell>

                <TableCell size='small'>

                    <Typography variant="caption">{tid}</Typography>

                </TableCell>

                <TableCell size='small'>  <Typography variant="caption">{tDate}</Typography></TableCell>

                <TableCell size='small'>
                    <Typography variant="caption">{title}</Typography>
                </TableCell>

                <TableCell align="center" size='small'>
                    <Label color={(type === "CREDIT" ? 'success' : 'error')}>{type}</Label>
                </TableCell>

                <TableCell size='small' align='right'>
                    <Label color='info'>₹{amount}</Label>
                </TableCell>

                <TableCell align="right" size='small'>
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 },
                }}
            >
                <MenuItem onClick={handleCloseMenu}>
                    <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}

UserTableRow.propTypes = {
    handleClick: PropTypes.func,
    selected: PropTypes.any,
    type: PropTypes.any,
    title: PropTypes.any,
    tDate: PropTypes.any,
    amount: PropTypes.any,
    tid: PropTypes.any,
    sno: PropTypes.any
};
