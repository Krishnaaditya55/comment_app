import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import moment from "moment";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const CommentModal = () => {
  const [open, setOpen] = useState(false);
  const [loanId, setLoanId] = useState("");
  const [newComment, setNewComment] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [comments, setComments] = useState([]);
  const [userList, setUserList] = useState([
    "John Doe",
    "Jane Smith",
    "David Johnson",
  ]);
  const [userListOpen, setUserListOpen] = useState(false);
  const userListButtonRef = useRef(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        "https://mocki.io/v1/b0c7d7ea-5d09-4b9c-8d4b-c1b40cc39bc9"
      );
      const data = await response.json();
      console.log("comments", data.comments);

      const updatedComments = data.comments.map((comment) => ({
        ...comment,
        taggedUsers: [],
      }));
      setComments(updatedComments);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  const generateLoanId = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    setLoanId(randomId);
  };

  const handleOpen = () => {
    generateLoanId();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleUserTag = (event, user) => {
    if (user) {
      if (taggedUsers.includes(user)) {
        setTaggedUsers(taggedUsers.filter((taggedUser) => taggedUser !== user));
      } else {
        setTaggedUsers([...taggedUsers, user]);
      }
    }
  };

  const handleUserInputChange = (event, value) => {
    setUserInput(value);
    setUserListOpen(true);
  };

  const handleUserAdd = () => {
    if (userInput.trim() === "") {
      enqueueSnackbar("Please enter a valid username.", { variant: "error" });
      return;
    }

    if (userList.includes(userInput)) {
      enqueueSnackbar("User already added.", { variant: "error" });
      return;
    }

    setUserList([...userList, userInput]);
    setUserInput("");
  };

  const handleSaveComment = () => {
    if (newComment.trim() === "") {
      enqueueSnackbar("Please enter a comment.", { variant: "error" });
      return;
    }
    if (taggedUsers.length === 0 || newComment.trim() === "") {
      enqueueSnackbar("Please tag at least one user.", { variant: "error" });
      return;
    }

    const comment = {
      comment: newComment,
      date: new Date().toISOString(),
      taggedUsers: taggedUsers,
    };

    setComments([...comments, comment]);
    setNewComment(""); // Clear the comment input field
    setTaggedUsers([]); // Clear the tagged users

    handleClose(); // Close the modal
  };

  const renderUserListDropdown = () => (
    <Menu
      id="user-list-menu"
      anchorEl={userListOpen ? userListButtonRef.current : null}
      open={userListOpen}
      onClose={() => setUserListOpen(false)}
    >
      {userList.map((user) => (
        <MenuItem key={user}>
          <Checkbox
            checked={taggedUsers.includes(user)}
            onChange={(event) => handleUserTag(event, user)}
          />
          <ListItemText primary={user} />
        </MenuItem>
      ))}

      <MenuItem>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Add User"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <Button size="medium" variant="contained" onClick={handleUserAdd}>
            Add
          </Button>
        </div>
      </MenuItem>
    </Menu>
  );

  const getInitials = (name) => {
    const names = name.split(" ");
    let initials = "";

    if (names.length > 0) {
      initials += names[0].charAt(0).toUpperCase();

      if (names.length > 1) {
        initials += names[names.length - 1].charAt(0).toUpperCase();
      }
    }

    return initials;
  };

  return (
    <div>
      <Box textAlign="center" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          justifyContent="center"
        >
          Add Comment
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>{""}</Grid>
            <Grid item>{""}</Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" component="h2">
                Comments ({comments.length})
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary">
                <Typography variant="body1">Loan ID: {loanId}</Typography>
              </Button>
            </Grid>
          </Grid>

          <List>
            {comments.map((comment, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemAvatar>
                    {comment.updatedBy && (
                      <Avatar>{getInitials(comment.updatedBy)}</Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography variant="h6" component="h6">
                          {comment.updatedBy}
                        </Typography>
                        <Typography variant="body1">
                          {comment.comment}
                          {""}
                          {comment.taggedUsers.length > 0 && (
                            <p>
                              {comment.taggedUsers.map((user, index) => (
                                <React.Fragment key={index}>
                                  <Button variant="outlined" size="small">
                                    {user}
                                  </Button>

                                  {index !== comment.taggedUsers.length - 1 &&
                                    " "}
                                </React.Fragment>
                              ))}
                            </p>
                          )}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={moment(comment.date).format(
                      "MMMM DD, YYYY h:mm A"
                    )}
                  />
                </ListItem>
              </div>
            ))}
          </List>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Autocomplete
              multiple
              options={userList}
              value={taggedUsers}
              onChange={handleUserTag}
              inputValue={userInput}
              onInputChange={handleUserInputChange}
              freeSolo
              style={{
                width: "80%",
              }}
              renderInput={(params) => <TextField {...params} label="Tag To" />}
            />

            <Button
              id="user-list-button"
              variant="outlined"
              onClick={() => setUserListOpen(true)}
              style={{ marginLeft: "10px" }}
              ref={userListButtonRef}
              endIcon={<ArrowDropDownIcon />}
              size="large"
            >
              User List
            </Button>
            {renderUserListDropdown()}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
              label="Add Comment"
              multiline
              rows={4}
              fullWidth
              value={newComment}
              onChange={handleCommentChange}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSaveComment}
              disabled={taggedUsers.length === 0 || newComment.trim() === ""}
            >
              Save Comment
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CommentModal;
