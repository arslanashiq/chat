import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import EmojiPicker from "emoji-picker-react";
// material
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { LoadingButton } from "@mui/lab";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import ReplyAllRoundedIcon from "@mui/icons-material/ReplyAllRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import CustomConfirmation from "../../components/CustomConfirmation";
import {
  start_chat,
  send_message,
  get_chat_by_id,
  get_chat_list,
  remove_message_from_chat,
} from "../../DAL/chat";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { get_customer_list } from "../../DAL/customer";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

// socket
import io from "socket.io-client";
import {
  connect_socket,
  _emit_socket_listner,
  _on_socket_listner,
} from "../../DAL/socket";

let socket = io();

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
export const useStyles = makeStyles((theme) => ({
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: "#848484",
    },
  },
}));

function ChatPageTest() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [customersList, setCustomersList] = useState([]);
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [SelectedChat, setSelectedChat] = useState(-1);
  const [chatDetail, setChatDetail] = useState("");
  const [targetChatPerson, setTargetChatPerson] = useState("");
  const [loader, setLoader] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatReaction, setChatReaction] = useState(null);
  //   socket
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [myInfo, setMyInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [showEmoji, setShowEmoji] = useState(false);
  const [personalMessageSetting, setPersonalMessageSetting] = useState(false);
  const [openDeleteMessageDilog, setOpenDeleteMessageDilog] = useState(false);
  const [chatReactionEmoji, setChatReactionEmoji] = useState([
    {
      title: "Smile",
      emoji: "😁",
    },
    {
      title: "Confuse",
      emoji: "😅",
    },

    {
      title: "Laugh",
      emoji: "😂",
    },
    {
      title: "In Love",
      emoji: "🥰",
    },
    {
      title: "Love",
      emoji: "❤️",
    },
    {
      title: "100%",
      emoji: "💯",
    },
    {
      title: "Thumbs Up",
      emoji: "👍",
    },
    {
      title: "Middle Fingre",
      emoji: "🖕",
    },
    {
      title: "Done",
      emoji: "✅",
    },
    {
      title: "Wrong",
      emoji: "❌",
    },
  ]);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(-1);

  const create_chat_with_customer = async (customer) => {
    setLoader(true);
    const postData = {
      chat_with: customer.user_id._id,
    };
    let resp = await start_chat(postData);
    if (resp.code == 200) {
      setChatDetail(resp.chat);
      setTargetChatPerson(customer);
      get_chat_between_customers(resp.chat);
    } else {
      enqueueSnackbar(resp.message, { variant: "error" });
    }
  };

  const get_chat_between_customers = async (chat) => {
    const resp = await get_chat_by_id(chat._id);
    if (resp.code == 200) {
      setChat(resp.message);
      setLoader(false);
    } else {
      enqueueSnackbar(resp.message, { variant: "error" });
    }
  };

  //   send message
  const handleSendMessage = async () => {
    if (newMessage.trim().length == 0) {
      return;
    }
    setSendingMessage(true);

    const postData = {
      receiver_id: targetChatPerson.user_id._id.toString(),
      chat_id: chatDetail._id,
      message: newMessage,
    };
    let resp = await send_message(postData);
    if (resp.code == 200) {
      chat.splice(0, 0, resp.message);
      setChat([...chat]);
      setSendingMessage(false);
      setNewMessage("");
      _emit_socket_listner("send_message", resp.message);
      document.getElementById("0")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      enqueueSnackbar(resp.message, { variant: "error" });
    }
  };

  const get_customers = async () => {
    const customer_list = [];
    let resp = await get_customer_list();
    if (resp.code == 200) {
      let my_info = JSON.parse(localStorage.getItem("user"));
      resp.customer.map((customer) => {
        if (customer._id != my_info._id) {
          customer_list.push({ ...customer, is_online: false });
        }
      });
      setCustomersList([...customer_list]);
      setLoader(false);
    } else {
      enqueueSnackbar(resp.message, { variant: "error" });
    }
  };
  const ChangeCustomerOnlineStatus = (resp, status) => {
    if (customersList && customersList.length > 0) {
      {
        customersList.map((customer, index) => {
          if (customer.user_id._id == resp.user_id) {
            customersList[index].is_online = status;
            setCustomersList([...customersList]);
          }
        });
      }
    }
  };
  const renderChatAction = (
    <Menu
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      anchorEl={anchorEl}
      sx={{ marginLeft: 1, forgr: "red" }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id="message-option"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={() => {
        setAnchorEl(null);
      }}
    >
      {targetChatPerson &&
        personalMessageSetting.receiver_id == targetChatPerson.user_id._id && (
          <MenuItem sx={{ fontSize: 11, fontWeight: "bold" }}>
            <Stack
              spacing={1}
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <EditIcon sx={{ fontSize: 12, fontWeight: "bold" }} />
              <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>
                Edit
              </Typography>
            </Stack>
          </MenuItem>
        )}

      <MenuItem sx={{ fontSize: 11 }}>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <ReplyOutlinedIcon sx={{ fontSize: 12, fontWeight: "bold" }} />
          <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>
            Reply
          </Typography>
        </Stack>
      </MenuItem>
      <MenuItem sx={{ fontSize: 11 }}>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <ReplyAllRoundedIcon sx={{ fontSize: 12, fontWeight: "bold" }} />
          <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>
            Forward
          </Typography>
        </Stack>
      </MenuItem>
      <MenuItem sx={{ fontSize: 11 }}>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ alignItems: "center", justifyContent: "center" }}
          onClick={() => {
            setOpenDeleteMessageDilog(true);
          }}
        >
          <DeleteOutlineOutlinedIcon
            sx={{ fontSize: 12, fontWeight: "bold" }}
          />
          <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>
            Remove
          </Typography>
        </Stack>
      </MenuItem>
    </Menu>
  );
  const renderChatReaction = (
    <Menu
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className={classes.menu}
      anchorEl={chatReaction}
      sx={{ marginLeft: 1 }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id="message-option"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={Boolean(chatReaction)}
      onClose={() => {
        setChatReaction(null);
      }}
    >
      <Stack
        direction={"row"}
        spacing={1}
        sx={{
          // width: 350,
          padding: 1,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {chatReactionEmoji.map((emoji, index) => (
          <Tooltip title={emoji.title} arrow placement="bottom">
            <Stack
              sx={{ cursor: "pointer", fontSize: 30, borderRadius: 10 }}
              onClick={(e) => {
                setChatReaction(null);
                chat[selectedMessageIndex].reaction = index;
                setChat([...chat]);
              }}
            >
              {emoji.emoji}
            </Stack>
          </Tooltip>
        ))}
      </Stack>
    </Menu>
  );
  const handleDeleteMessageConfirmation = () => {
    setOpenDeleteMessageDilog(true);
  };
  const RemoveMessageFromChat = (data) => {
    chat.map((c, index) => {
      if (c._id == data.message_id) {
        chat.splice(index, 1);
      }
    });
    setChat([...chat]);
  };
  const handleDeleteMessage = async () => {
    try {
      setAnchorEl(null);
      const postData = {
        chat_id: personalMessageSetting.chat_id,
      };
      const resp = await remove_message_from_chat(
        personalMessageSetting._id,
        postData
      );
      if (resp.code == 200) {
        enqueueSnackbar(resp.message, { variant: "success" });
        const data = {
          ...resp.data,
          ...targetChatPerson,
          message_id: personalMessageSetting._id,
          receiver_id: targetChatPerson.user_id._id,
        };
        _emit_socket_listner("delete_message", data);

        RemoveMessageFromChat(data);
        setOpenDeleteMessageDilog(false);
      } else {
        enqueueSnackbar(resp.message, { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  // useeffect
  useEffect(() => {
    get_customers();
  }, []);

  useEffect(() => {
    socket = connect_socket(myInfo.user_id._id);
    _on_socket_listner(
      "connect",
      async function (value) {
        console.log("Connected", socket.connected);
      },
      { once: true }
    );
    _on_socket_listner(
      "disconnect",
      async function (value) {
        console.log("Disconnected", socket.connected);
      },
      { once: true }
    );
    _on_socket_listner(
      "member_offline",
      async (resp) => {
        ChangeCustomerOnlineStatus(resp, false);
      },
      { once: true }
    );
    _on_socket_listner(
      "user_online",
      async (resp) => {
        ChangeCustomerOnlineStatus(resp, true);
      },
      { once: true }
    );

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  _on_socket_listner(
    `${myInfo.user_id._id}_send_message_to_receiver`,
    async (resp) => {
      if (!chat.includes(resp)) {
        console.warn("Message received", resp);
        chat.splice(0, 0, resp);
        setChat([...chat]);
      }
    },
    { once: true }
  );
  _on_socket_listner(
    `${myInfo.user_id._id}_delete_message_receiver`,
    async (resp) => {
      console.warn("Message received", resp);
      RemoveMessageFromChat(resp);
    },
    { once: true }
  );
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#ebf3fa",
        height: "90vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showEmoji && (
        <Grid
          style={{
            // visibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 50,
          }}
          onClick={() => {
            setShowEmoji(false);
          }}
        ></Grid>
      )}
      <CustomConfirmation
        open={openDeleteMessageDilog}
        setOpen={setOpenDeleteMessageDilog}
        handleAgree={handleDeleteMessage}
        title={"Are you sure you want to delete this message?"}
      />
      {renderChatAction}
      {renderChatReaction}
      <Backdrop
        sx={{
          color: "#fff",
          pointerEvents: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loader}
        // onClick={setLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container>
        <Grid
          item
          xs={4}
          sm={3}
          sx={{
            height: "90vh",
            overflowY: "scroll",
            borderRight: "2px solid #e9e9e9",
          }}
        >
          <Stack>
            {customersList &&
              customersList.length > 0 &&
              customersList.map((customer, index) => (
                <Stack
                  direction={"row"}
                  spacing={1}
                  key={customer._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      SelectedChat === index ? "#b5d8f5" : "#dfecf2",
                    borderBottom: 1,
                    padding: 1,
                  }}
                  onClick={() => {
                    if (SelectedChat === index) return;
                    create_chat_with_customer(customer);
                    setSelectedChat(index);
                  }}
                >
                  <Stack>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant={customer.is_online ? "dot" : ""}
                    >
                      <Avatar src={customer.profile_image} />
                    </StyledBadge>
                  </Stack>
                  <Stack>
                    <Typography fontWeight={"600"}>
                      {" "}
                      {customer.full_name}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
          </Stack>
        </Grid>

        {/* chat grid */}
        <Grid item xs={8} sm={9} sx={{ height: "90vh", position: "relative" }}>
          {/* chat */}
          <Stack
            direction={"column-reverse"}
            sx={{
              borderRadius: 1,
              paddingTop: 4,
              paddingBottom: "14vh",
              marginBottom: 1,
              height: "90vh",
              overflowY: "scroll",
            }}
          >
            {chat.map((c, index) => (
              <Stack
                direction={
                  c.sender_id == targetChatPerson.user_id._id
                    ? "row"
                    : "row-reverse"
                }
                key={index}
                id={index}
                sx={{ marginLeft: 2, marginRight: 2, alignItems: "center" }}
              >
                {chat[index - 1] ? (
                  !(chat[index - 1].sender_id === c.sender_id) ? (
                    <Stack>
                      <Avatar src={c.profile} sx={{ height: 30, width: 30 }} />
                    </Stack>
                  ) : (
                    <Stack sx={{ height: 30, width: 30 }}></Stack>
                  )
                ) : (
                  <Stack>
                    <Avatar src={c.profile} sx={{ height: 30, width: 30 }} />
                  </Stack>
                )}
                <Stack
                  direction={
                    c.sender_id == targetChatPerson.user_id._id
                      ? "row"
                      : "row-reverse"
                  }
                  sx={{ alignItems: "center", position: "relative" }}
                >
                  <Stack
                    sx={{
                      backgroundColor:
                        c.sender_id == targetChatPerson.user_id._id
                          ? "#d0d0d0"
                          : "#00aff0",
                      padding: 1,
                      marginBottom: 2,
                      marginLeft: 1.2,
                      marginRight: 1.2,
                      display: "flex",
                      borderRadius: 3,
                      position: "relative",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 12, fontWeight: "500", maxWidth: 550 }}
                      onContextMenu={(e) => {
                        setPersonalMessageSetting({ ...c });
                        setAnchorEl(e.currentTarget);
                        e.preventDefault();
                      }}
                    >
                      {c.message}
                    </Typography>

                    {c.sender_id == targetChatPerson.user_id._id &&
                      c.reaction && (
                        <Stack
                          sx={{
                            height: 25,
                            width: 25,
                            backgroundColor: "white",
                            position: "absolute",
                            bottom: -10,

                            left: -8,
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: 15,
                          }}
                        >
                          {chatReactionEmoji[c.reaction].emoji}
                        </Stack>
                      )}
                  </Stack>
                  {c.sender_id == targetChatPerson.user_id._id && (
                    <IconButton
                      sx={{
                        height: 8,
                        width: 8,
                        color: "grey",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: -5,
                        right: 10,
                      }}
                      onClick={(e) => {
                        setSelectedMessageIndex(index);
                        setPersonalMessageSetting({ ...c });
                        setChatReaction(e.currentTarget);
                      }}
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      color="inherit"
                    >
                      <SentimentSatisfiedAltIcon
                        sx={{ height: 15, width: 15 }}
                      />
                    </IconButton>
                  )}
                  <IconButton
                    sx={{
                      height: 8,
                      width: 8,
                      color: "grey",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={(e) => {
                      setPersonalMessageSetting({ ...c });
                      setAnchorEl(e.currentTarget);
                    }}
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <MoreVertIcon sx={{ height: 15, width: 15 }} />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
          {/* chat message box */}
          {SelectedChat != -1 && (
            <Stack
              direction={"row"}
              spacing={0.5}
              sx={{
                position: "absolute",
                backgroundColor: "#bad1db",
                bottom: 0,
                width: "100%",
                paddingLeft: 1,
                paddingRight: 1,
                alignItems: "end",
                paddingBottom: "1%",
                paddingTop: "1%",
              }}
            >
              {showEmoji && (
                <Stack
                  sx={{
                    zIndex: 100,
                    visibility: showEmoji ? "none" : "visible",
                    position: "absolute",
                    right: 130,
                    bottom: 50,
                  }}
                >
                  {/* epr-preview */}
                  <EmojiPicker
                    height={300}
                    searchDisabled
                    lazyLoadEmojis
                    emojiStyle="facebook"
                    // emojiStyle="google"
                    // emojiStyle="twitter"
                    // emojiStyle="native"
                    // emojiStyle="apple"
                    suggestedEmojisMode="recent"
                    PreviewConfig={{
                      showPreview: false,
                    }}
                    onEmojiClick={(e) => {
                      setNewMessage((prevmessage) => prevmessage + e.emoji);
                    }}
                  />
                </Stack>
              )}
              <FormControl fullWidth sx={{ m: 1 }}>
                <OutlinedInput
                  id="EmojiInput"
                  multiline
                  maxRows={3}
                  value={newMessage}
                  onChange={(e) => {
                    console.log(e.target, "value");
                    setNewMessage(e.target.value);
                  }}
                  size="small"
                  sx={{
                    backgroundColor: "white",
                    fontSize: 12,
                    width: "100%",
                    borderRadius: 2,
                    overflow: "scroll",
                  }}
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => {
                          setShowEmoji(!showEmoji);
                        }}
                      >
                        <SentimentSatisfiedAltIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label=""
                />
              </FormControl>
              {/* <TextField
                multiline
                maxRows={5}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
                size="small"
                sx={{
                  backgroundColor: "white",
                  fontSize: 12,
                  width: "90%",
                  borderRadius: 2,
                }}
              /> */}
              <IconButton>
                <AttachFileIcon />
              </IconButton>
              <IconButton
                id="sendmessagebtn"
                sx={{
                  color: newMessage.trim().length > 0 ? "#1565c0" : "#ebf3fa",
                  justifyContent: "start",
                  alignItems: "start",
                }}
                disabled={sendingMessage}
                onClick={handleSendMessage}
              >
                {sendingMessage ? (
                  <CircularProgress size={25} color="info" />
                ) : (
                  <SendIcon sx={{ fontSize: 25 }} />
                )}
              </IconButton>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatPageTest;
