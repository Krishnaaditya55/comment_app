import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import moment from "moment";

const API_URL = "https://mocki.io/v1/b0c7d7ea-5d09-4b9c-8d4b-c1b40cc39bc9";

const CommentList = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <List>
      {comments.map((comment) => (
        <ListItem key={comment.id}>
          <ListItemText
            primary={comment.comment}
            secondary={moment(comment.date).format("MMMM DD, YYYY h:mm A")}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CommentList;
