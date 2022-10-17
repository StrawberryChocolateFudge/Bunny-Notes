import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import VerifyIcon from "@mui/icons-material/Note"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
interface VerifyNoteTabProps {
      noteString: string
      setMyNoteString: (newValue: string) => void;

}

export default function VerifyNoteTab(props: VerifyNoteTabProps) {

      const noteStringSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            props.setMyNoteString(event.target.value);
      }

      return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
            <AppBar
                  position="static"
                  color="default"
                  elevation={0}
                  sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
            >
                  <Toolbar>
                        <Grid container spacing={2} alignItems="center">
                              <Grid item>
                                    <VerifyIcon color="inherit" sx={{ display: 'block' }} />
                              </Grid>
                              <Grid item xs>
                                    <TextField value={props.noteString} onChange={noteStringSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                              </Grid>
                              <Grid item>
                                    <Tooltip title="Verify the pasted Note">
                                          <Button variant="contained" sx={{ mr: 1 }}>
                                                Verify
                                          </Button>
                                    </Tooltip>
                              </Grid>
                        </Grid>
                  </Toolbar>
            </AppBar>
            <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px", textAlign: "center" }}>
                  <Button variant="contained" size="large">
                        <Typography textAlign={"center"} variant="h5" component="h5">Scan Note</Typography>
                  </Button>

            </Box>
      </Paper >

}