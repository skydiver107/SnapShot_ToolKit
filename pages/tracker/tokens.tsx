import React, { Fragment, MouseEventHandler, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router';
import InfiniteScroll from "react-infinite-scroll-component";
import {
	LAMPORTS_PER_SOL
} from '@solana/web3.js';

import Autocomplete, { createFilterOptions, autocompleteClasses } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Stack from "@mui/material/Stack";
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar } from "@mui/material";

import AddPlus from 'src/components/IconButton/AddPlus';
import ZoomGlass from 'src/components/IconButton/ZoomGlass';
import WhiteCircle from 'src/components/IconButton/WhiteCircle';
import WhiteDown from 'src/components/IconButton/WhiteDown';
import WhiteUp from "@components/IconButton/WhiteUp";
// import WhiteUp from 'src/components/IconButton/WhiteUp';
import CloseCancel from 'src/components/IconButton/CloseCancel';
import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';

import { numberToFix, parseNumber } from "src/common/utils/helpers"
import { DATA_API, LIMIT_COLUMNS, TIME_RANGE } from "src/common/config";

import fetchData from "src/common/services/getDataWithAxios";

import PageInfo from "src/components/PageContainer/PageInfo";



const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledPopper = styled(Popper)({
	[`& .${autocompleteClasses.listbox}`]: {
		boxSizing: 'border-box',
		// fontSize: '20px !important ',
		'& .MuiAutocomplete-popper': {
			margin: '20px'
		},
	},
});

const trackFields: {
	menu: string,
	field: string,
	isStatistic: boolean,
	isLamport: boolean
}[] = [
		{
			menu: `projects`,
			field: `name`,
			isStatistic: false,
			isLamport: false
		},
		{
			menu: `supply`,
			field: `supply`,
			isStatistic: false,
			isLamport: false
		},
		{
			menu: `listed`,
			field: `listed`,
			isStatistic: false,
			isLamport: false
		},
		{
			menu: `% change`,
			field: `listedChange`,
			isStatistic: true,
			isLamport: false
		},
		{
			menu: `floor`,
			field: `floor`,
			isStatistic: false,
			isLamport: true
		},
		{
			menu: `% change`,
			field: `floorChange`,
			isStatistic: true,
			isLamport: true
		},
		{
			menu: `avg.sale`,
			field: `avgSale`,
			isStatistic: false,
			isLamport: true
		},
		{
			menu: `% change`,
			field: `avgSaleChange`,
			isStatistic: true,
			isLamport: false
		},
		// {
		// 	menu: `volume`,
		// 	field: `volume`,
		// 	isStatistic: false,
		// 	isLamport: true
		// },
		// {
		// 	menu: `24h volume`,
		// 	field: `volume24hr`,
		// 	isStatistic: false,
		// 	isLamport: true
		// },
		// {
		// 	menu: `% change`,
		// 	field: `volume24hrChange`,
		// 	isStatistic: true,
		// 	isLamport: false
		// }
	];

const Tokens = () => {
	const router = useRouter();

	// For Alert
	const [openConf, setOpenConf] = useState<boolean>(false);

	// For data
	const [collectibles, setCollectibles] = useState<any>([]);
	const [myTracks, setMyTracks] = useState<any>([]);
	const [originalMyTracks, setOriginalMyTracks] = useState<any>([]);

	// For get scroll infinit
	const [hasMore, setHasMore] = useState<boolean>(false);
	const [offset, setOffset] = useState<number>(1);

	// For delete Collection
	const [deleteCollection, setDeleteCollection] = useState<string>(``);

	// For Real time fetching
	const [timer, setTimer] = React.useState(null);



	// For Register Collection
	const [registCollection, setRegistCollection] = useState<any>([]);

	// For user login
	const [isSigned, setIsSigned] = useState<boolean>(true);
	const [userName, setUserName] = useState<string>(`root`);

	// For Load More
	const [loadIndex, setLoadIndex] = useState<number>(0);

	// For sorting
	const [sortField, setSortField] = useState<string>('');
	const [sortMode, setSortMode] = useState<boolean>(false);

	// For searching
	const [trackSearch, setTrackSearch] = useState<string>('');

	// For alert message
	const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
	const [messageContent, setMessageContent] = useState<string>(``);
	const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);
	const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setIsShowMessage(false);
	};

	// For loading
	const [showLoading, setShowLoading] = React.useState<boolean>(false);

	// For scrolling by clicking button
	// const step = 8;
	// const scrollRef: any = useRef();
	// const isScrollRef: any = useRef();
	// const scrollMove = () => {
	//   if (isScrollRef.current) {
	//     scrollRef.current.scrollTop = scrollRef.current.scrollTop + step;
	//     requestAnimationFrame(scrollMove);
	//   }
	// };

	const getSelectibles = async (filter: string) => {
		try {
			const collections: any = await fetchData({
				method: `get`,
				route: `${DATA_API.GET_COLLECTIONS}?offset=0&page_size=10000&symbol=${filter}`
			});

			if (Array.isArray(collections) && collections.length > 0) {
				setCollectibles([...collections]);
			}
		}
		catch (err) {

		}
	}

	// For Handle Alert Modal
	const closeConfDialog = () => {
		setOpenConf(false);
	}

	// const verifyUser = async () => {
	//   setRegistCollection([]);
	//   if (userName) {
	//     setShowLoading(true);
	//     try {
	//       const trackData = await fetchData({
	//         method: `post`,
	//         route: DATA_API.SIGN_IN,
	//         data: {
	//           user: `root`
	//         }
	//       });
	//       if (trackData) {

	//         const myNftTracks: any = await fetchData({
	//           method: `get`,
	//           route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${offset}&page_size=${256}`
	//         });

	//         setMyTracks(myNftTracks?.nfts || []);
	//         setOriginalMyTracks(myNftTracks?.nfts || []);
	//       }
	//       else {
	//         setIsShowMessage(true);
	//         setMessageContent(`Invalid user! Please check your name!`);
	//         setMessageSeverity(`error`);
	//       }
	//     }
	//     catch (err) {
	//       setIsShowMessage(true);
	//       setMessageContent(`Can't fetch your track data! Please check your network!`);
	//       setMessageSeverity(`error`);
	//     }
	//     finally {
	//       setShowLoading(false);
	//     }
	//   }
	//   else {
	//     setIsShowMessage(true);
	//     setMessageContent(`Please input your Name!`);
	//     setMessageSeverity(`warning`);
	//   }
	// }

	const addCollection = async () => {
		if (registCollection.length > 0) {
			let succeed = 0, failed = 0, total = registCollection.length;
			setShowLoading(true);
			try {
				let res: any[] = [];
				for (let i = 0; i < total; i++) {
					const result: any = await fetchData({
						method: `post`,
						route: `${DATA_API.TRACK_NFTS.REGIST_TRACKS}/${userName}`,
						data: {
							symbol: registCollection[i]?.symbol
						}
					});

					if (result && Array.isArray(result?.nfts)) {
						res = result?.nfts || [];
						succeed++;
					}
					else {
						failed++;
					}
				}

				if (res?.length > 0) {
					setMyTracks([...res]);
				}

				setIsShowMessage(true);
				setMessageContent(`Succeed: ${succeed} and Failed: ${failed} (In total of ${total})`);
				setMessageSeverity(`info`);
			}
			catch (err) {
				setIsShowMessage(true);
				setMessageContent(`Operation is failed! Please check your network! Succeed: (${succeed} and Failed: ${failed} [In total of ${total}])`);
				setMessageSeverity(`error`);
			}
			finally {
				setShowLoading(false);
				setRegistCollection([]);
				setCollectibles([]);
			}
		}
		else {
			setIsShowMessage(true);
			setMessageContent(`Please select more than one collection!`);
			setMessageSeverity(`warning`);
		}
	}

	const deleteOneCollection = async () => {
		if (deleteCollection) {
			setShowLoading(true);
			try {
				const result = await fetchData({
					method: `post`,
					route: `${DATA_API.TRACK_NFTS.DELETE_TRACKS}/${userName}/delete`,
					data: {
						symbol: deleteCollection
					}
				});
				if (result) {
					const filtered = myTracks.filter((track: any, index: number) => { return track.symbol != deleteCollection });
					setMyTracks(filtered);
					setOpenConf(false);
					setIsShowMessage(true);
					setMessageContent(`Selected collection deleted!`);
					setMessageSeverity(`info`);
				}
				else {
					setIsShowMessage(true);
					setMessageContent(`Operation is failed! Please check your network!`);
					setMessageSeverity(`error`);
				}

			}
			catch (err) {
				setIsShowMessage(true);
				setMessageContent(`Operation is failed! Please check your network!`);
				setMessageSeverity(`error`);
			}
			finally {
				setShowLoading(false);
			}
		}
		else {
			setIsShowMessage(true);
			setMessageContent(`Please select the collection!`);
			setMessageSeverity(`warning`);
		}
	}

	const sortData = async (field: string) => {
		if (field) {
			const tempMyTrackData = myTracks;
			tempMyTrackData.sort((a: any, b: any) => {
				if (field == `name`) {
					return sortMode ? ('' + a[field]).localeCompare(b[field]) : ('' + b[field]).localeCompare(a[field]);
				}
				else {
					return sortMode ? (a[field] - b[field]) : (b[field] - a[field]);
				}
			});
			setMyTracks(tempMyTrackData);
			setSortField(field);
			setSortMode(!sortMode);
		}
		else {
			setIsShowMessage(true);
			setMessageContent(`Invalid Field! Please try again.`);
			setMessageSeverity(`warning`);
		}
	}

	const searchMyTrack = async () => {
		if (trackSearch) {
			const tempMyTrackData = myTracks;
			const lowerSearch = trackSearch.toLocaleLowerCase();
			const res = tempMyTrackData.filter((track: any, index: number) => {
				const lowerName = track?.name.toLocaleLowerCase();
				return lowerName.includes(lowerSearch);
			});
			setMyTracks([...res]);
		}
		else {
			setMyTracks([...originalMyTracks]);
		}
	}

	const fetchMyTrack = async () => {
		try {
			if (userName) {
				new Promise((myResolve, myReject) => {
					const myNftTracks: any = fetchData({
						method: `get`,
						route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${0}&page_size=${(offset) * 12}`
					});

					myResolve(myNftTracks);

				}).then((res) => {
					let result = [], temp: any = res;
					if (temp?.length > 0) {
						result = temp?.nfts || [];
					}
					if (result && Array.isArray(result) && result?.length > 0) {
						setMyTracks([...result]);
					}
				});
			}
		}
		catch (err) {

		}

		clearTimeout(timer);
		setTimer(setTimeout(fetchMyTrack, TIME_RANGE));
	}

	const fetchScrollTrack = async () => {
		try {
			setOffset(offset + 1);
			const myNftTracks: any = await fetchData({
				method: `get`,
				route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${offset}&page_size=${12}`
			});

			let res = [];
			if (myNftTracks?.nfts?.length > 0) {
				res = myNftTracks?.nfts || [];
				setMyTracks([...myTracks, ...res]);
			}

			if (res.length < 1) {
				setHasMore(false);
			}
		}
		catch (err) {
		}
	}

	useEffect(() => {
		(async () => {
			try {
				if (isSigned) {
					fetchMyTrack();
				}
			}
			catch (err) {
			}
		})()
	}, [isSigned]);

	useEffect(() => {
		(async () => {
			setShowLoading(true);
			try {
				const myNftTracks: any = await fetchData({
					method: `get`,
					route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${0}&page_size=${12}`
				});

				const tempMyTrackData = myNftTracks.nfts || [];
				tempMyTrackData.sort((a: any, b: any) => {
					return (b.volume24hr - a.volume24hr);
				});
				if (tempMyTrackData.length > 12) {
					setHasMore(true);
				}
				setMyTracks(tempMyTrackData);
				setOriginalMyTracks(tempMyTrackData);
				setSortField(`volume24hr`);
			}
			catch (err) {
				setIsShowMessage(true);
				setMessageContent(`Can't fetch your track data! Please check your network!`);
				setMessageSeverity(`error`);
			}
			finally {
				setShowLoading(false);
			}
		})()
	}, []);

	return (
		<>
			<PageInfo>
				<Box
					sx={{
						display: `flex`,
						justifyContent: `flex-end`,
						flexGrow: 1
					}}
				>
					<Box
						sx={{
							width: `100%`,
							display: `flex`,
							alignItems: `center`,
							justifyContent: `right`
						}}
					>
						<AddPlus
							sx={{
								width: `1.5rem`,
								height: `1.5rem`,
								mr: 1,
								'&:hover': {
									cursor: `pointer`,
									opacity: 0.7
								}
							}}
							onClick={async () => {
								await addCollection();
							}}
						/>
						<Autocomplete
							multiple
							id="tags-outlined"
							options={collectibles}
							getOptionLabel={(option: { name: string, symbol: string, image: string }) => option.name}
							renderOption={(props, option: any) => (
								<li {...props} key={option.symbol}  >{option.name}</li>
								// <Typography   {...props} key={option.symbol} style={{ fontSize: '0.75rem !important ' }}>{option.name}</Typography>
							)}
							renderInput={(params) => (

								<TextField
									{...params}
									sx={{
										'& input': {
											fontSize: `0.75rem`
										}
									}}
									placeholder={`add tokens`}
								// inputProps={{ style: { fontSize: 50 } }}
								// InputLabelProps={{ step: 300, }}
								// InputLabelProps={{ ...params.InputLabelProps, style: { fontSize: "10rem" } }}
								>

								</TextField>

							)}
							PopperComponent={StyledPopper}
							size={`small`}
							onChange={(event: React.ChangeEvent<HTMLInputElement>, newValue) => {
								setRegistCollection([...newValue]);
							}}
							onInputChange={async (event, newInputValue) => {
								if (newInputValue.length > 2) {
									await getSelectibles(newInputValue);
								}
								else {
									if (newInputValue.length < 1) {
										setCollectibles([]);
									}

								}

							}}
							sx={{
								width: `100%`,
								background: theme => theme.palette.background.paper,
								border: `none`,
								fontSize: `0.6rem !important`,
								py: 0,
								'& .MuiFormControl-root .MuiInputBase-root': {
									py: `1.5px !important`
								},
								'& *': {
									fontSize: `0.75rem`
								}
							}}

							value={registCollection}
						/>
					</Box>

					<Box
						sx={{
							width: `100%`,
							display: `flex`,
							alignItems: `center`,
							justifyContent: `right`
						}}
					>
						<ZoomGlass
							sx={{
								width: `1.5rem`,
								height: `1.5rem`,
								ml: 3,
								mr: 1,
								'&:hover': {
									cursor: `pointer`,
									opacity: 0.7
								}
							}}
							onClick={async () => {
								await searchMyTrack();
							}}
						/>
						<TextField
							id="outlined-basic"
							variant="outlined"
							value={trackSearch}
							size={`small`}
							sx={{
								width: `100%`,
								background: theme => theme.palette.background.paper,
								border: `none`,
								'& .MuiInputBase-input': {
									py: 0.5
								},
								'& input': {
									fontSize: `0.75em`
								}
							}}
							placeholder={`search tracker`}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setTrackSearch(event.target.value);
							}}

							onKeyDown={async (event) => {
								if (event.keyCode == 13) {
									await searchMyTrack();
								}
							}}
						/>
					</Box>
				</Box>
			</PageInfo>

			<Box
				sx={{
					mx: `auto`,
					py: 3,
					px: 19,
					background: `none`,
					position: `relative`
				}}
			>

				<TableContainer
					component={`div`}
					sx={{
						overflow: `auto`,
						position: `relative`,
					}}
				>
					<InfiniteScroll
						dataLength={myTracks?.length}
						next={async () => { await fetchScrollTrack() }}
						hasMore={hasMore}
						loader={
							<Typography variant={`h6`} sx={{ mt: 2, mx: `auto`, textAlign: `center` }}>
								Loading...
							</Typography>
						}
					>
						<Table
							aria-label="simple table"
						>
							<TableHead
								sx={{
									background: theme => `${theme.palette.background.paper}`
								}}
							>
								<TableRow>
									<TableCell
										sx={{
											border: `none`,
											width: {
												lg: `5%`,
												xl: `4.8%`,
											}
										}}
									>

									</TableCell>
									{
										trackFields.map((menu: any, index: number) => {
											return (
												<TableCell
													sx={{
														width: {
															lg: index == 0 ? `20%` : `7.2%`,
															xl: index == 0 ? `25%` : `6.8%`,
														},
														border: `none`,
														py: 1.5,
														px: 1,
														pl: index == 0 ? 3 : 1,
														borderRight: [3, 5, 7].includes(index) ? theme => `solid 1px ${theme.palette.common.black}` : `none`
													}}
													key={index}
												>
													<Stack
														direction={`row`}
														alignItems={`center`}
														justifyContent={
															index == 0 ? `flex-start` : `center`
														}
													>
														<Stack
															direction={`column`}
															alignItems={`center`}
															justifyContent={`center`}
														>
															{
																sortField == menu?.field ? (sortMode ?
																	<WhiteDown
																		sx={{
																			width: `1.5rem`,
																			height: `1.5rem`,
																			'&:hover': {
																				cursor: `pointer`,
																				opacity: 0.7
																			}
																		}}
																		onClick={async () => {
																			await sortData(menu?.field);
																		}}
																	/> :
																	<WhiteUp
																		sx={{
																			width: `1.5rem`,
																			height: `1.5rem`,

																			'&:hover': {
																				cursor: `pointer`,
																				opacity: 0.7
																			}
																		}}
																		onClick={async () => {
																			await sortData(menu?.field);
																		}}
																	/>
																) :
																	<WhiteCircle
																		sx={{
																			width: `1.5rem`,
																			height: `1.5rem`,
																			'&:hover': {
																				cursor: `pointer`,
																				opacity: 0.7
																			}
																		}}
																		onClick={async () => {
																			await sortData(menu?.field);
																		}}
																	/>
															}
															<Typography variant={`subtitle2`} sx={{ mt: 0.5 }}>
																{menu.menu}
															</Typography>

														</Stack>
													</Stack>
												</TableCell>
											);
										})
									}
									<TableCell
										sx={{
											border: `none`,
											width: {
												lg: `7.2%`,
												xl: `6.8%`,
											}
										}}
									>

									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{myTracks.map((track: any, index: number) => (
									<>
										<TableRow
											key={index}
											sx={{
												'&:hover': {
													cursor: `pointer`
												}
											}}
										>
											<TableCell
												sx={{
													borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
													background: theme => `${theme.palette.background.default}`,

												}}
												onClick={(e: any) => {
													e.preventDefault();
													router.push(`/tracker/${userName}/${track.symbol}`);
												}}
											>
												<Avatar src={myTracks[index].image} />
											</TableCell>
											{
												trackFields.map((field: any, _index: number) => {
													return (
														<>
															<TableCell
																align="center"
																key={_index}
																sx={{
																	borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
																	borderRight: [3, 5, 7].includes(_index) ? theme => `solid 1px ${theme.palette.neutral.main}` : `none`,
																	background: theme => `${theme.palette.background.default}`,
																	py: 1.5,
																	px: 1,
																	pl: _index == 0 ? 3 : 1,
																}}
																onClick={(e: any) => {
																	e.preventDefault();
																	router.push(`/tracker/${userName}/${track.symbol}`);
																}}
															>

																<Stack
																	direction={`row`}
																	alignItems={`center`}
																	justifyContent={
																		_index == 0 ? `flex-start` : `center`
																	}
																>
																	<Box
																		sx={{
																			display: `flex`,
																			alignItems: `center`,
																			justifyContent: `center`
																		}}
																	>
																		{
																			field?.isStatistic && track[field?.field] != undefined && track[field?.field] > 0 && <GreenUp sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} />
																		}

																		{
																			field?.isStatistic && track[field?.field] != undefined && track[field?.field] < 0 && <RedDown sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} />
																		}

																		<Typography variant={`subtitle2`} color={`inherit`}>
																			{
																				field?.isStatistic && track[field?.field] != undefined && `${numberToFix(parseNumber(track[field?.field] * 100))}%`
																			}

																			{
																				!field?.isStatistic && !field?.isLamport && track[field?.field] != undefined && !isNaN(parseFloat(track[field?.field])) && numberToFix(track[field?.field])
																			}

																			{/* {
                                    !field?.isStatistic && !field?.isLamport && track[field?.field] != undefined && myTracks[index].image
                                  } */}
																			{/* {
                                    myTracks[index].image
                                  } */}
																			{
																				!field?.isStatistic && !field?.isLamport && track[field?.field] != undefined && isNaN(parseFloat(track[field?.field])) && track[field?.field]
																			}

																			{
																				!field?.isStatistic && field?.isLamport && track[field?.field] != undefined && numberToFix((track[field?.field] / LAMPORTS_PER_SOL))
																			}
																		</Typography>
																	</Box>
																</Stack>
															</TableCell>
														</>
													);
												})
											}
											<TableCell
												sx={{
													border: `none`,
													borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
													background: theme => `${theme.palette.background.default}`,
												}}
											>
												<Stack
													direction={`row`}
													alignItems={`center`}
													justifyContent={`center`}
												>

												</Stack>
												<CloseCancel
													sx={{
														width: `1rem`,
														height: `1rem`,
														'&:hover': {
															cursor: `pointer`,
															opacity: 0.7
														}
													}}
													onClick={async (event: any) => {
														event.preventDefault();
														setDeleteCollection(track.symbol);
														setOpenConf(true);
													}}
												/>
											</TableCell>
										</TableRow>
									</>

								))}
							</TableBody>
						</Table>
					</InfiniteScroll>
				</TableContainer>
				<Dialog open={false} onClose={() => { }}>
					<DialogTitle>
						<Typography

							variant={`h5`}
						>
							{`Sign In`}
						</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText

							variant={`body1`}
							sx={{
								mb: 2
							}}
						>
							{`To get your track data, please input your <USER NAME> and click <Sign In> button.`}
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Your Name"
							type="text"
							fullWidth
							variant="standard"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setUserName(event.target.value);
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button variant={`contained`}
							onClick={async () => {
								await verifyUser();
							}}
						>
							Sign In</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={openConf}
					onClose={closeConfDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Do you want to delete this collecion?"}
					</DialogTitle>
					<DialogActions>
						<Button onClick={closeConfDialog}>Cancel</Button>
						<Button onClick={() => { deleteOneCollection() }} autoFocus>
							Delete
						</Button>
					</DialogActions>
				</Dialog>

				<Snackbar open={isShowMessage} autoHideDuration={5000} onClose={closeMessage} sx={{ zIndex: 10001 }}>
					<Alert onClose={closeMessage} severity={messageSeverity} sx={{ width: '100%', zIndex: 10001 }}>
						{messageContent}
					</Alert>
				</Snackbar>

				<Backdrop
					sx={{ color: '#fff', zIndex: 9999 }}
					open={showLoading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			</Box>
		</>

	);
}

export default Tokens;
