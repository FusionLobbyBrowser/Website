import { Converter } from "./unityRichText.js";
import { barcodes, layers } from "./const.js";
import { getSelf, getFriends } from "./steam.js";
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.min.mjs";

// Is this overkill? probably

// To get value changed event, listen for event "onsettingchanged" on window

export let friends = [
  {
    steamId: "76561198979969592",
    profileVisibility: 3,
    profileState: 1,
    nickname: "wojtekwol44",
    lastLoggedOffDate: "2026-07-14T17:50:50",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561198979969592/",
    avatarUrl:
      "https://avatars.steamstatic.com/9abee64c1b84c0da1033b48d4bf084fd20ed1213.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/9abee64c1b84c0da1033b48d4bf084fd20ed1213_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/9abee64c1b84c0da1033b48d4bf084fd20ed1213_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2019-07-26T13:43:07",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199017891509",
    profileVisibility: 3,
    profileState: 1,
    nickname: "pan ciekawer",
    lastLoggedOffDate: "2026-07-14T20:22:40",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/id/AdSabProHomie/",
    avatarUrl:
      "https://avatars.steamstatic.com/e9cf2ca2d534f9205e9557faef94cd2e7b8b225e.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/e9cf2ca2d534f9205e9557faef94cd2e7b8b225e_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/e9cf2ca2d534f9205e9557faef94cd2e7b8b225e_full.jpg",
    userStatus: 1,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-01-12T09:15:37",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198835076696",
    profileVisibility: 3,
    profileState: 1,
    nickname: "BOGYMA",
    lastLoggedOffDate: "2026-07-15T00:52:10",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561198835076696/",
    avatarUrl:
      "https://avatars.steamstatic.com/015f4da838e5cbfaefafae09a71769e99a40cac2.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/015f4da838e5cbfaefafae09a71769e99a40cac2_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/015f4da838e5cbfaefafae09a71769e99a40cac2_full.jpg",
    userStatus: 3,
    realName: null,
    primaryGroupId: "103582791436076995",
    accountCreatedDate: "2018-05-09T22:30:57",
    countryCode: "US",
    stateCode: "TX",
    cityCode: 3620,
    playingGameName: "Risk of Rain 2",
    playingGameId: "632360",
    playingGameServerIP: "24.161.122.84:7777",
  },
  {
    steamId: "76561198726944269",
    profileVisibility: 3,
    profileState: 1,
    nickname: "kubasgaja",
    lastLoggedOffDate: "2026-04-04T10:29:22",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561198726944269/",
    avatarUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2026-03-20T19:41:11",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199070459294",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Munti",
    lastLoggedOffDate: "2026-07-07T14:13:28",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199070459294/",
    avatarUrl:
      "https://avatars.steamstatic.com/93be6882f10a7f3f4f599ba683fdedceafbf1b97.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/93be6882f10a7f3f4f599ba683fdedceafbf1b97_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/93be6882f10a7f3f4f599ba683fdedceafbf1b97_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-06-29T18:11:39",
    countryCode: "PL",
    stateCode: "74",
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198259383032",
    profileVisibility: 3,
    profileState: 0,
    nickname: "dawidgon",
    lastLoggedOffDate: "2024-11-08T15:19:05",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561198259383032/",
    avatarUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2015-11-08T07:32:49",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199475655378",
    profileVisibility: 3,
    profileState: 1,
    nickname: "pankraken10",
    lastLoggedOffDate: "2026-07-15T13:03:10",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199475655378/",
    avatarUrl:
      "https://avatars.steamstatic.com/2b34c4d4a0091f9bf36f5ba36c984897caa7f38f.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/2b34c4d4a0091f9bf36f5ba36c984897caa7f38f_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/2b34c4d4a0091f9bf36f5ba36c984897caa7f38f_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-02-02T20:35:57",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198420798413",
    profileVisibility: 3,
    profileState: 1,
    nickname: "TCU",
    lastLoggedOffDate: "2026-07-15T02:46:45",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/id/TotallyCreativeUsername/",
    avatarUrl:
      "https://avatars.steamstatic.com/73054023da02a0a4e0aea0387d95a7ec478c85b5.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/73054023da02a0a4e0aea0387d95a7ec478c85b5_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/73054023da02a0a4e0aea0387d95a7ec478c85b5_full.jpg",
    userStatus: 3,
    realName: "TotallyCreativeUsername",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2017-09-10T13:00:56",
    countryCode: "US",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199529904944",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Rico",
    lastLoggedOffDate: "2026-07-15T10:56:04",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199529904944/",
    avatarUrl:
      "https://avatars.steamstatic.com/eaa5f44e0ba137efa88c732880001f3c590459fd.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/eaa5f44e0ba137efa88c732880001f3c590459fd_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/eaa5f44e0ba137efa88c732880001f3c590459fd_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-07-25T18:59:48",
    countryCode: "PL",
    stateCode: "43",
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198958107268",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Togi",
    lastLoggedOffDate: "2026-07-13T19:22:50",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561198958107268/",
    avatarUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2019-04-21T17:12:00",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199509384055",
    profileVisibility: 3,
    profileState: 1,
    nickname: "KL0CHA",
    lastLoggedOffDate: "2026-07-09T13:47:50",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199509384055/",
    avatarUrl:
      "https://avatars.steamstatic.com/9db4379c2531f5accd95570c7ac358f7169393dc.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/9db4379c2531f5accd95570c7ac358f7169393dc_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/9db4379c2531f5accd95570c7ac358f7169393dc_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-05-28T08:32:30",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198298618127",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Lady Geist - Controller Gaming",
    lastLoggedOffDate: "2026-07-13T08:00:34",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/id/tarekinnit/",
    avatarUrl:
      "https://avatars.steamstatic.com/a12eaccdb7a5fec959c562ae12d6e8d809c3a402.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/a12eaccdb7a5fec959c562ae12d6e8d809c3a402_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/a12eaccdb7a5fec959c562ae12d6e8d809c3a402_full.jpg",
    userStatus: 0,
    realName: "Why do you wanna know that tho?",
    primaryGroupId: "103582791434761767",
    accountCreatedDate: "2016-04-07T15:16:13",
    countryCode: "DE",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199439348686",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Niewiemcomamrobic",
    lastLoggedOffDate: "2026-07-12T18:09:34",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199439348686/",
    avatarUrl:
      "https://avatars.steamstatic.com/04f2507e4b74ac5002ea5c68a15afbda4312f1fd.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/04f2507e4b74ac5002ea5c68a15afbda4312f1fd_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/04f2507e4b74ac5002ea5c68a15afbda4312f1fd_full.jpg",
    userStatus: 0,
    realName: "Tymek",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2022-11-29T19:06:29",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199042222863",
    profileVisibility: 3,
    profileState: 1,
    nickname: "raccoonmanthing",
    lastLoggedOffDate: "2026-07-15T09:21:09",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/id/Raccoonmanthing/",
    avatarUrl:
      "https://avatars.steamstatic.com/dc213dde4fab9c74854fd7f3e06d0722fccaa3ee.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/dc213dde4fab9c74854fd7f3e06d0722fccaa3ee_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/dc213dde4fab9c74854fd7f3e06d0722fccaa3ee_full.jpg",
    userStatus: 0,
    realName: "grayson",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-04-02T23:23:08",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198974481884",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Rich Hexee",
    lastLoggedOffDate: "2026-07-15T10:14:12",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561198974481884/",
    avatarUrl:
      "https://avatars.steamstatic.com/674e6d348307de31869c0e6d2b7561f17cb20d01.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/674e6d348307de31869c0e6d2b7561f17cb20d01_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/674e6d348307de31869c0e6d2b7561f17cb20d01_full.jpg",
    userStatus: 1,
    realName: null,
    primaryGroupId: "103582791475040131",
    accountCreatedDate: "2019-07-02T13:49:33",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198749507370",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Leetify",
    lastLoggedOffDate: "2026-07-14T18:21:03",
    commentPermission: 2,
    profileUrl: "https://steamcommunity.com/profiles/76561198749507370/",
    avatarUrl:
      "https://avatars.steamstatic.com/baa87460ec3924f72d0842d8dc361f8285649656.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/baa87460ec3924f72d0842d8dc361f8285649656_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/baa87460ec3924f72d0842d8dc361f8285649656_full.jpg",
    userStatus: 1,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2026-01-16T23:16:44",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198450114438",
    profileVisibility: 3,
    profileState: 1,
    nickname: "g l o b",
    lastLoggedOffDate: "2026-07-15T13:30:14",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561198450114438/",
    avatarUrl:
      "https://avatars.steamstatic.com/4f9cbea54fa7933c8ad0ccffff7c619d59615426.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/4f9cbea54fa7933c8ad0ccffff7c619d59615426_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/4f9cbea54fa7933c8ad0ccffff7c619d59615426_full.jpg",
    userStatus: 0,
    realName: "g l o b",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2017-11-28T00:36:02",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199505863913",
    profileVisibility: 3,
    profileState: 1,
    nickname: "janek_667",
    lastLoggedOffDate: "2026-05-30T09:06:39",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199505863913/",
    avatarUrl:
      "https://avatars.steamstatic.com/bfd0269eb568463afdd90f6184ed5cf6e4d1cbc9.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/bfd0269eb568463afdd90f6184ed5cf6e4d1cbc9_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/bfd0269eb568463afdd90f6184ed5cf6e4d1cbc9_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-05-15T08:09:52",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199059900726",
    profileVisibility: 3,
    profileState: 1,
    nickname: "MirrorRune",
    lastLoggedOffDate: "2026-07-13T09:30:06",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199059900726/",
    avatarUrl:
      "https://avatars.steamstatic.com/b61a4c4d94ed382e329eb3737ec8e841f903ff7a.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/b61a4c4d94ed382e329eb3737ec8e841f903ff7a_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/b61a4c4d94ed382e329eb3737ec8e841f903ff7a_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-05-21T10:35:09",
    countryCode: "PL",
    stateCode: "87",
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199401716388",
    profileVisibility: 3,
    profileState: 1,
    nickname: "shizzonoo",
    lastLoggedOffDate: "2026-07-14T07:37:31",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199401716388/",
    avatarUrl:
      "https://avatars.steamstatic.com/360236e555049f204b12d3a8685a3b9b9764ebfe.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/360236e555049f204b12d3a8685a3b9b9764ebfe_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/360236e555049f204b12d3a8685a3b9b9764ebfe_full.jpg",
    userStatus: 0,
    realName: "xx",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2022-09-24T09:12:29",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199583892133",
    profileVisibility: 3,
    profileState: 1,
    nickname: "waligorajan9",
    lastLoggedOffDate: "2026-05-23T11:06:14",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199583892133/",
    avatarUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-12-16T15:38:27",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199123796144",
    profileVisibility: 3,
    profileState: 1,
    nickname: "TATOOS",
    lastLoggedOffDate: "2026-07-11T10:14:18",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/id/tatoos/",
    avatarUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-12-29T10:14:03",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198369615279",
    profileVisibility: 3,
    profileState: 1,
    nickname: "stinker",
    lastLoggedOffDate: "2026-07-15T08:58:13",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561198369615279/",
    avatarUrl:
      "https://avatars.steamstatic.com/4e0c982c67528f6ad3f7e4a3d594fb3d592a1f44.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/4e0c982c67528f6ad3f7e4a3d594fb3d592a1f44_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/4e0c982c67528f6ad3f7e4a3d594fb3d592a1f44_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2017-02-26T05:08:18",
    countryCode: "US",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198248623982",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Jack Baker (Real)",
    lastLoggedOffDate: "2026-07-15T05:43:10",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/id/WELCOMETOTHEFAMILYSON/",
    avatarUrl:
      "https://avatars.steamstatic.com/d93ef817f7411b5248fdd91d513217da2bd0c30d.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/d93ef817f7411b5248fdd91d513217da2bd0c30d_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/d93ef817f7411b5248fdd91d513217da2bd0c30d_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2015-09-04T15:33:21",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199204639819",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Tomasz pala",
    lastLoggedOffDate: "2026-07-15T12:10:50",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199204639819/",
    avatarUrl:
      "https://avatars.steamstatic.com/1a1a48fa47df3c3dbc8c07dcedfcf763a7eab647.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/1a1a48fa47df3c3dbc8c07dcedfcf763a7eab647_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/1a1a48fa47df3c3dbc8c07dcedfcf763a7eab647_full.jpg",
    userStatus: 0,
    realName: ".",
    primaryGroupId: "103582791470026297",
    accountCreatedDate: "2021-09-03T16:07:52",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199261663559",
    profileVisibility: 3,
    profileState: 1,
    nickname: "garebare",
    lastLoggedOffDate: "2026-07-15T01:47:28",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199261663559/",
    avatarUrl:
      "https://avatars.steamstatic.com/43d8aa1dd08475e1c6d47b8d17ea2ab2f6ed970b.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/43d8aa1dd08475e1c6d47b8d17ea2ab2f6ed970b_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/43d8aa1dd08475e1c6d47b8d17ea2ab2f6ed970b_full.jpg",
    userStatus: 1,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2022-04-04T16:00:25",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: "The Outlast Trials",
    playingGameId: "1304930",
    playingGameServerIP: null,
  },
  {
    steamId: "76561199093739685",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Beldrog",
    lastLoggedOffDate: "2026-07-14T20:58:05",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199093739685/",
    avatarUrl:
      "https://avatars.steamstatic.com/148ff422f2245ab66abfeabf3f7506861d6b703b.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/148ff422f2245ab66abfeabf3f7506861d6b703b_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/148ff422f2245ab66abfeabf3f7506861d6b703b_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-09-25T12:01:51",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199502603869",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Gen1us",
    lastLoggedOffDate: "2026-07-14T22:16:26",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199502603869/",
    avatarUrl:
      "https://avatars.steamstatic.com/e82502be98b58d5283d557ef2521c685e9f9372e.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/e82502be98b58d5283d557ef2521c685e9f9372e_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/e82502be98b58d5283d557ef2521c685e9f9372e_full.jpg",
    userStatus: 3,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-05-06T16:52:08",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: "Counter-Strike 2",
    playingGameId: "730",
    playingGameServerIP: null,
  },
  {
    steamId: "76561199098347065",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Serek Wiejski",
    lastLoggedOffDate: "2026-06-09T20:06:16",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199098347065/",
    avatarUrl:
      "https://avatars.steamstatic.com/2ef86ceab53edf4604c06a1e832e241768671454.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/2ef86ceab53edf4604c06a1e832e241768671454_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/2ef86ceab53edf4604c06a1e832e241768671454_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-10-13T15:47:30",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199474177436",
    profileVisibility: 3,
    profileState: 1,
    nickname: "vxll..",
    lastLoggedOffDate: "2026-07-05T22:05:09",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199474177436/",
    avatarUrl:
      "https://avatars.steamstatic.com/9330e1349a7f4e1fe4b229dd2bc2978dd9f135db.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/9330e1349a7f4e1fe4b229dd2bc2978dd9f135db_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/9330e1349a7f4e1fe4b229dd2bc2978dd9f135db_full.jpg",
    userStatus: 0,
    realName: "val",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-01-29T15:23:45",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199214981297",
    profileVisibility: 3,
    profileState: 1,
    nickname: "facebook",
    lastLoggedOffDate: "2026-07-15T04:41:05",
    commentPermission: 0,
    profileUrl:
      "https://steamcommunity.com/id/oklookatdislookatdismasterpiece/",
    avatarUrl:
      "https://avatars.steamstatic.com/6a07289ca3263407c34d4519d662dff1f44e7758.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/6a07289ca3263407c34d4519d662dff1f44e7758_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/6a07289ca3263407c34d4519d662dff1f44e7758_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2021-10-15T13:07:33",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198398644740",
    profileVisibility: 3,
    profileState: 1,
    nickname: "watarod",
    lastLoggedOffDate: "2026-06-26T23:10:12",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561198398644740/",
    avatarUrl:
      "https://avatars.steamstatic.com/36ae3c20f904481ad8a5e7af1d914cee9f081223.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/36ae3c20f904481ad8a5e7af1d914cee9f081223_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/36ae3c20f904481ad8a5e7af1d914cee9f081223_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2017-06-19T14:53:31",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199475614587",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Ghost",
    lastLoggedOffDate: "2026-07-14T22:17:05",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199475614587/",
    avatarUrl:
      "https://avatars.steamstatic.com/fe5553dcc2c218c8fd27026d85752b2df73e4bd8.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fe5553dcc2c218c8fd27026d85752b2df73e4bd8_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fe5553dcc2c218c8fd27026d85752b2df73e4bd8_full.jpg",
    userStatus: 1,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2023-02-02T18:43:10",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: "The Isle",
    playingGameId: "376210",
    playingGameServerIP: null,
  },
  {
    steamId: "76561199019979566",
    profileVisibility: 3,
    profileState: 1,
    nickname: "resnek",
    lastLoggedOffDate: "2026-07-08T03:16:09",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199019979566/",
    avatarUrl:
      "https://avatars.steamstatic.com/5ebe3a42becf789fd76dd0efbd0ab289d1c003ae.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/5ebe3a42becf789fd76dd0efbd0ab289d1c003ae_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/5ebe3a42becf789fd76dd0efbd0ab289d1c003ae_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-01-18T16:34:03",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198674941795",
    profileVisibility: 3,
    profileState: 1,
    nickname: "ILoveTCU",
    lastLoggedOffDate: "2026-07-13T16:46:35",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/id/ilovetcu/",
    avatarUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2026-07-12T08:58:57",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199866805699",
    profileVisibility: 3,
    profileState: 1,
    nickname: "ZVX13",
    lastLoggedOffDate: "2026-04-23T17:21:43",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199866805699/",
    avatarUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2025-06-13T19:23:15",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199092612171",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Rozbójnik z bagna kapucynek",
    lastLoggedOffDate: "2026-07-08T22:56:24",
    commentPermission: 2,
    profileUrl: "https://steamcommunity.com/profiles/76561199092612171/",
    avatarUrl:
      "https://avatars.steamstatic.com/733ff202d8f8fccfeef289c3b0079af75a46c29b.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/733ff202d8f8fccfeef289c3b0079af75a46c29b_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/733ff202d8f8fccfeef289c3b0079af75a46c29b_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-09-21T14:32:50",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198150369047",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Tymon3310",
    lastLoggedOffDate: "2026-07-15T02:17:11",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/id/Tymon3310/",
    avatarUrl:
      "https://avatars.steamstatic.com/eb26b48b497d976b440bff2816464acea78091f5.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/eb26b48b497d976b440bff2816464acea78091f5_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/eb26b48b497d976b440bff2816464acea78091f5_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2014-08-17T11:59:11",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199854325381",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Mammut",
    lastLoggedOffDate: "2026-06-30T23:56:51",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199854325381/",
    avatarUrl:
      "https://avatars.steamstatic.com/e34879eb198b1ac1fcf1de8cb15720c4ba576161.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/e34879eb198b1ac1fcf1de8cb15720c4ba576161_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/e34879eb198b1ac1fcf1de8cb15720c4ba576161_full.jpg",
    userStatus: 0,
    realName: "Mammut",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2025-05-10T16:58:16",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199871004789",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Szarlota",
    lastLoggedOffDate: "2026-07-13T21:14:08",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199871004789/",
    avatarUrl:
      "https://avatars.steamstatic.com/c5f63cb7c6a7b9069d7939950236298e4e3bcd41.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/c5f63cb7c6a7b9069d7939950236298e4e3bcd41_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/c5f63cb7c6a7b9069d7939950236298e4e3bcd41_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2025-06-28T17:46:43",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199228692900",
    profileVisibility: 3,
    profileState: 1,
    nickname: "aydan",
    lastLoggedOffDate: "2026-07-15T02:38:19",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199228692900/",
    avatarUrl:
      "https://avatars.steamstatic.com/eb9073d704926b630fd7dfbb80d71e3cbadcc09c.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/eb9073d704926b630fd7dfbb80d71e3cbadcc09c_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/eb9073d704926b630fd7dfbb80d71e3cbadcc09c_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2021-12-22T03:05:17",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199235558730",
    profileVisibility: 3,
    profileState: 1,
    nickname: "T3M HARNAŚ",
    lastLoggedOffDate: "2026-07-14T21:01:09",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199235558730/",
    avatarUrl:
      "https://avatars.steamstatic.com/600a54e62405d2696730eabca74233adfd9aea7e.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/600a54e62405d2696730eabca74233adfd9aea7e_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/600a54e62405d2696730eabca74233adfd9aea7e_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2022-01-16T14:21:39",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199095790264",
    profileVisibility: 3,
    profileState: 1,
    nickname: "K0m0rniczek",
    lastLoggedOffDate: "2026-07-15T01:48:30",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199095790264/",
    avatarUrl:
      "https://avatars.steamstatic.com/ebc4587b999f2cc1250ec0500efd1507ff774509.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/ebc4587b999f2cc1250ec0500efd1507ff774509_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/ebc4587b999f2cc1250ec0500efd1507ff774509_full.jpg",
    userStatus: 1,
    realName: "K0m0rniczek",
    primaryGroupId: "103582791475734328",
    accountCreatedDate: "2020-10-06T19:08:33",
    countryCode: "UZ",
    stateCode: "07",
    cityCode: 46337,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199108326592",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Billy Herrington",
    lastLoggedOffDate: "2026-07-15T13:01:05",
    commentPermission: 2,
    profileUrl: "https://steamcommunity.com/profiles/76561199108326592/",
    avatarUrl:
      "https://avatars.steamstatic.com/52f567e1e3fdd9269b9cf15cb183dff386deee32.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/52f567e1e3fdd9269b9cf15cb183dff386deee32_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/52f567e1e3fdd9269b9cf15cb183dff386deee32_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2020-11-19T17:45:19",
    countryCode: "NE",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561198323412794",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Filipokd",
    lastLoggedOffDate: "2026-07-14T23:13:17",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561198323412794/",
    avatarUrl:
      "https://avatars.steamstatic.com/1b86a41997c55ed1716b3d5392cb2f9542878a21.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/1b86a41997c55ed1716b3d5392cb2f9542878a21_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/1b86a41997c55ed1716b3d5392cb2f9542878a21_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791475152331",
    accountCreatedDate: "2016-08-06T07:59:11",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199814475088",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Nagi Seishiro",
    lastLoggedOffDate: "2026-07-02T13:24:54",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199814475088/",
    avatarUrl:
      "https://avatars.steamstatic.com/01da70ed6500b6b11a39ed80e7db77a0ad02f8cd.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/01da70ed6500b6b11a39ed80e7db77a0ad02f8cd_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/01da70ed6500b6b11a39ed80e7db77a0ad02f8cd_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2025-01-05T23:48:19",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199242738662",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Kemorii",
    lastLoggedOffDate: "2026-07-15T13:22:32",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199242738662/",
    avatarUrl:
      "https://avatars.steamstatic.com/998bb31c45414f37e0f33c009ce9c1cac01ec156.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/998bb31c45414f37e0f33c009ce9c1cac01ec156_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/998bb31c45414f37e0f33c009ce9c1cac01ec156_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2022-02-09T17:16:19",
    countryCode: "PL",
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199258146504",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Bulkazchlebem123",
    lastLoggedOffDate: "2026-07-15T13:03:47",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199258146504/",
    avatarUrl:
      "https://avatars.steamstatic.com/47f223f76ff8a523b9e5f98ca711e9fdc52665ee.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/47f223f76ff8a523b9e5f98ca711e9fdc52665ee_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/47f223f76ff8a523b9e5f98ca711e9fdc52665ee_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791433237993",
    accountCreatedDate: "2022-03-24T20:36:07",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199436345101",
    profileVisibility: 3,
    profileState: 1,
    nickname: "MeTeOoO",
    lastLoggedOffDate: "2026-07-07T09:51:30",
    commentPermission: 0,
    profileUrl: "https://steamcommunity.com/profiles/76561199436345101/",
    avatarUrl:
      "https://avatars.steamstatic.com/1750c2a9421b3ac43234a385988d8a5fd831b0a7.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/1750c2a9421b3ac43234a385988d8a5fd831b0a7_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/1750c2a9421b3ac43234a385988d8a5fd831b0a7_full.jpg",
    userStatus: 0,
    realName: "Kacper Tybura",
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2022-11-20T17:45:16",
    countryCode: "PL",
    stateCode: "43",
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
  {
    steamId: "76561199013544761",
    profileVisibility: 3,
    profileState: 1,
    nickname: "Wojtmic",
    lastLoggedOffDate: "2026-06-28T20:24:46",
    commentPermission: 1,
    profileUrl: "https://steamcommunity.com/profiles/76561199013544761/",
    avatarUrl:
      "https://avatars.steamstatic.com/7ae537b6b7b7b09e68f52e76cdb8f0727f5cb270.jpg",
    avatarMediumUrl:
      "https://avatars.steamstatic.com/7ae537b6b7b7b09e68f52e76cdb8f0727f5cb270_medium.jpg",
    avatarFullUrl:
      "https://avatars.steamstatic.com/7ae537b6b7b7b09e68f52e76cdb8f0727f5cb270_full.jpg",
    userStatus: 0,
    realName: null,
    primaryGroupId: "103582791429521408",
    accountCreatedDate: "2019-12-27T13:31:16",
    countryCode: null,
    stateCode: null,
    cityCode: 0,
    playingGameName: null,
    playingGameId: null,
    playingGameServerIP: null,
  },
];

let friendListElem;
let friendsCancel;
export let areFriendsFetched = false;

let categories = [
  {
    name: "General",
    icon: "fa-solid fa-house",
    expanded: true,
  },
  {
    name: "Groups",
    icon: "fa-solid fa-book",
    expanded: false,
  },
  {
    name: "Platforms",
    icon: "fa-solid fa-computer",
    expanded: true,
  },
  {
    name: "Players",
    icon: "fa-solid fa-users",
    expanded: false,
  },
  {
    name: "Visibility",
    icon: "fa-solid fa-eye",
    expanded: false,
  },
  {
    name: "Level",
    icon: "fa-solid fa-map",
    expanded: false,
  },
  {
    name: "Gamemodes",
    icon: "fa-solid fa-puzzle-piece",
    expanded: false,

    sort: true,
    sortMode: "filterTotalCount",
    sortOrder: 1,
  },
  {
    name: "Filtering",
    icon: "fa-solid fa-shield-halved",
    expanded: false,
  },
  {
    name: "Steam Friends",
    icon: "fa-brands fa-steam",
    expanded: false,
    customHandler: async (container) => {
      if (friendsCancel) friendsCancel.abort();
      const controller = new AbortController();
      friendsCancel = controller;

      fillCategory({
        name: "Steam Friends",
      });

      const list = container.getElementsByTagName("div")[0];
      friendListElem = list;
      list.classList.add("friendsContainer");

      const divider = document.createElement("div");
      divider.classList.add("divider");
      list.appendChild(divider);

      const toCopy = document.getElementById("friendToCopy");
      const order = [6, 1, 4, 2, 3, 0, 5];

      let seconds = 0;
      function counter() {
        seconds++;
        if (seconds >= 30) create();
      }

      async function create(ignore = false) {
        if (!ignore) {
          if (document.hidden || !document.hasFocus()) return;
        }
        if (controller?.aborted == true) {
          clearInterval(counter);
          return;
        }
        seconds = 0;

        /*
        const self = await getSelf();
        if (!self) {
          notice(
            list,
            "Not Logged In!",
            "You need to log in with Steam to view friends list!",
            "fas fa-arrow-right-to-bracket",
          );
          areFriendsFetched = true;
          window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
          return;
        }
        friends = await getFriends(self.steamId);
        if (friends == false) {
          friends = [];
          notice(
            list,
            "Friends List Not Public!",
            "You must set your steam friends list to be public!",
            "fas fa-xmark",
            "--flb-error-color",
          );
          areFriendsFetched = true;
          window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
          return;
        } else if (!friends) {
          notice(
            list,
            "Failed!",
            "Failed to fetch friends list",
            "fas fa-xmark",
            "--flb-error-color",
          );
          areFriendsFetched = true;
          window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
          return;
        }
          */

        const sorted = structuredClone(friends);
        sorted.forEach((f) => {
          if (f.playingGameName && f.playingGameName != "") f.userStatus = 6;
        });
        sorted.sort(
          (a, b) =>
            order.findIndex((x) => x == a.userStatus) -
            order.findIndex((x) => x == b.userStatus),
        );
        sorted.forEach((f) => {
          let elem = list.querySelector(`div[steamid="${f.steamId}"]`);
          if (!elem) elem = toCopy.cloneNode(true);
          elem.removeAttribute("id");
          const avatar = elem.getElementsByClassName("friendAvatar")[0];
          if (f.userStatus == 0) {
            elem.classList.add("hidden");
            avatar.loading = "lazy";
            avatar.fetchpriority = "low";
          } else {
            elem.classList.remove("hidden");
            avatar.loading = "eager";
            avatar.fetchpriority = "auto";
          }
          elem.setAttribute("steamid", f.steamId);
          avatar.width = 32;
          avatar.height = 32;
          avatar.setAttribute("alt", `Avatar of ${f.nickname}`);
          avatar.setAttribute(
            "src",
            f.avatarUrl.replace(
              "avatars.steamstatic.com",
              "avatars.fastly.steamstatic.com",
            ),
          );
          const username = elem.getElementsByClassName("friendUsername")[0];
          username.textContent = f.nickname;
          username.href = f.profileUrl;
          const additionalInfo = elem.getElementsByClassName(
            "steamAdditionalInfo",
          )[0];
          const inLobby = friendsLobbies.find((x) => x.id == f.steamId);
          if (!inLobby) {
            additionalInfo.style.color = window
              .getComputedStyle(toCopy)
              .getPropertyValue(`--flb-status${f.userStatus}-color`);
            elem.style.order = order.findIndex((x) => x == f.userStatus) + 1;
          } else {
            elem.setAttribute("overridenInfo", "true");
            elem.style.order = 0;
            additionalInfo.style.color = window
              .getComputedStyle(toCopy)
              .getPropertyValue(`--flb-status6-color`);
            additionalInfo.innerHTML = `Playing in a lobby - ${inLobby.lobbyName}`;
          }

          let status;
          switch (f.userStatus) {
            case 0:
              status = "Offline";
              break;
            case 1:
              status = "Online";
              break;
            case 2:
              status = "Busy";
              break;
            case 3:
              status = "Away";
              break;
            case 4:
              status = "AFK...";
              break;
            case 6:
              status = `Playing a game${f.playingGameName && f.playingGameName != "" ? ` - ${f.playingGameName}` : ""}`;
              break;
            default:
              status = "Unknown status";
              break;
          }

          if (!inLobby) additionalInfo.textContent = status;

          elem.setAttribute("userStatus", f.userStatus);
          elem.setAttribute("infoText", status);

          list.appendChild(elem);
        });
        list.childNodes.forEach((x) => {
          if (
            x.classList.contains("steamAccount") &&
            !friends.find((f) => f.steamId == x.getAttribute("steamid"))
          )
            x.remove();
        });
        areFriendsFetched = true;
        window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
      }
      create(true);

      setInterval(counter, 1000);
    },
  },
];

const RP_LEVELS = [
  "T0x1c.HoodCorner.Level.GmHoodCornerDay",
  "T0x1c.HoodCorner.Level.GmHoodCornerNight",
  "T0x1c.RPSouthside.Level.RPSouthside",
  "jiggy.gmnightlight.Level.gmdaylight",
  "jiggy.gmnightlight.Level.gmnightlight",
  "Cheezy.HoodCorner.Level.GmHoodCorner",
  "SoldierThree57.rpdowntowntiny.Level.rpdowntowntinynight",
  "SoldierThree57.rpdowntowntiny.Level.rpdowntowntinyday",
];

export let settings = [
  // General
  {
    id: "searchField",
    category: "General",
    type: "search",
    name: "Search",
    icon: "fa-solid fa-magnifying-glass",
    defaultValue: "",
    filterValue: (s, val) => val && val.length > 0,
    lobbyFilter: true,
    lobbyValidator: (lobby, val) => {
      const name =
        lobby.lobbyName != ""
          ? lobby.lobbyName
          : `${lobby.lobbyHostName}'s Lobby`;
      const fuse = new Fuse([Converter.removeRichText(name.toLowerCase())], {
        threshold: 0.35,
      });
      const res = fuse.search(val);
      return !res || res.length < 1;
    },
    setFilterName: false,
    saveToStorage: false,
  },
  {
    id: "sort",
    name: "Sort Mode",
    category: "General",
    type: "select",
    displayLabel: false,
    values: [
      {
        name: "Alphabetical",
        icon: "fas fa-arrow-down-a-z",
      },
      {
        name: "Players",
        icon: "fas fa-people-group",
      },
      {
        name: "Uptime",
        icon: "fas fa-clock",
      },
    ],
    defaultValue: "Players",
  },
  {
    id: "sortOrder",
    name: "Sort Order",
    category: "General",
    type: "select",
    displayLabel: false,
    values: [
      {
        name: "Ascending",
        icon: "fas fa-arrow-up",
      },
      {
        name: "Descending",
        icon: "fas fa-arrow-down",
      },
    ],
    defaultValue: "Descending",
  },
  {
    id: "theme",
    name: "Theme",
    category: "General",
    type: "select",
    icon: "fas fa-fill-drip",
    values: [
      {
        name: "System Preference",
        id: "systemPreference",
        icon: "fas fa-computer",
      },
      {
        name: "Dark",
        id: "dark",
        icon: "fas fa-moon",
      },
      {
        name: "Light",
        id: "light",
        icon: "fas fa-sun",
      },
    ],
    defaultValue: "systemPreference",
  },
  {
    id: "autoRefresh",
    category: "General",
    type: "toggle",
    name: "Auto Refresh",
    icon: "fa-solid fa-arrows-rotate fa-spin",
    defaultValue: false,
  },
  // Groups
  {
    id: "roleplayLobbies",
    category: "Groups",
    type: "toggle",
    name: "Roleplay",
    icon: "fa-solid fa-briefcase",

    lobbyFilter: true,
    filterValue: false,
    filterWords: ["shooting", "shooter", "rp", "war", "roleplay"],
    filterLevels: RP_LEVELS,

    defaultValue: true,
  },
  {
    id: "hoodLobbies",
    category: "Groups",
    type: "toggle",
    name: "Hood RP",
    icon: "fa-solid fa-person-rifle",

    lobbyFilter: true,
    filterValue: false,
    filterWords: ["hood", "hoodrp"],
    filterLevels: RP_LEVELS,

    defaultValue: true,
  },
  {
    id: "russianLobbies",
    category: "Groups",
    type: "toggle",
    name: "Russian",
    icon: "fi fis fi-ru",

    lobbyFilter: true,
    filterValue: false,
    filterWords: ["russian", "russia", "rus", "russ", "russi", "russkie", "ru"],

    defaultValue: true,
  },
  {
    id: "horrorLobbies",
    category: "Groups",
    type: "toggle",
    name: "Horror",
    icon: "fa-solid fa-ghost",

    lobbyFilter: true,
    filterValue: false,
    filterWords: [
      "horror",
      "monster",
      "survive",
      "killer",
      "hide and seek",
      "hide & seek",
      "hideseek",
      "hideandseek",
      "hide n seek",
    ],

    defaultValue: true,
  },
  {
    id: "backroomsLobbies",
    category: "Groups",
    type: "toggle",
    name: "Backrooms",
    icon: "fa-solid fa-biohazard",

    lobbyFilter: true,
    filterValue: false,
    filterWords: ["backrooms", "backroom"],
    filterLevels: [
      "0gravity.BackroomsEntropy.Level.BackroomsEntropy",
      "HombresGuapos.TheBackroomsA24.Level.TheBackroomsA24",
    ],

    defaultValue: true,
  },
  {
    id: "otherLobbies",
    category: "Groups",
    type: "toggle",
    name: "Other",
    icon: "fa-solid fa-plus",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      for (const x of settings) {
        if (x.category != "Groups") continue;

        if (!x.filterWords) continue;
        if (isGroup(lobby, x.filterWords)) return false;
      }
      return true;
    },

    defaultValue: true,
  },
  // Platforms
  {
    id: "steamPlatform",
    category: "Platforms",
    type: "toggle",
    name: "Steam",
    icon: "fa-brands fa-steam",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.lobbyPlatform == "Steam";
    },

    defaultValue: true,
  },
  {
    id: "epicPlatform",
    category: "Platforms",
    type: "toggle",
    name: "Epic Games",
    icon: "fa-custom fa-epicgames",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.lobbyPlatform == "Epic";
    },

    defaultValue: false,
  },
  // Visibility
  {
    id: "publicLobbies",
    category: "Visibility",
    type: "toggle",
    name: "Public",
    icon: "fas fa-user-group",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.privacy == 0;
    },

    defaultValue: true,
  },
  {
    id: "friendsOnlyLobbies",
    category: "Visibility",
    type: "toggle",
    name: "Friends Only",
    icon: "fas fa-user-lock",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.privacy == 2;
    },

    defaultValue: true,
  },
  // Levels
  {
    id: "vanillaLevels",
    category: "Level",
    type: "toggle",
    name: "Vanilla",
    icon: "fas fa-map-location-dot",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return barcodes.find((x) => x.barcode == lobby.levelBarcode);
    },

    defaultValue: true,
  },
  {
    id: "moddedLevels",
    category: "Level",
    type: "toggle",
    name: "Modded",
    icon: "fas fa-wrench",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return !barcodes.find((x) => x.barcode == lobby.levelBarcode);
    },

    defaultValue: true,
  },
  // Players
  {
    id: "playerCount",
    category: "Players",
    type: "range",
    name: "Player Count",
    icon: "fa-solid fa-people-arrows",

    filterValue: (s, val) =>
      val &&
      val.min &&
      val.max &&
      !(val.min == s.minValue && val.max == s.maxValue),
    lobbyFilter: true,
    setFilterName: false,
    lobbyValidator: (lobby, val) => {
      return lobby.playerCount < val.min || lobby.playerCount > val.max;
    },

    minValue: 1,
    maxValue: 20,
    step: 1,

    defaultValue: { min: 1, max: 20 },
    storeAsJSON: true,
  },
  {
    id: "fullLobbies",
    category: "Players",
    type: "toggle",
    icon: "fa-solid fa-users-viewfinder",
    name: "Full Lobbies",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.playerCount == lobby.maxPlayers;
    },

    defaultValue: false,
  },
  // Filtering
  {
    id: "censorNSFW",
    category: "Filtering",
    type: "toggle",
    name: "Censor NSFW",
    icon: "fa-solid fa-lock",
    defaultValue: true,
  },
  {
    id: "hideNSFWLobbies",
    category: "Filtering",
    type: "toggle",
    name: "Hide NSFW Lobbies",
    icon: "fa-solid fa-shield",
    defaultValue: true,
  },
  {
    id: "censorProfanities",
    category: "Filtering",
    type: "toggle",
    name: "Censor Profanities",
    icon: "fa-solid fa-hand-middle-finger",
    defaultValue: true,
  },
  // Steam Friends
  {
    id: "prioritizeLobbiesWithFriends",
    category: "Steam Friends",
    type: "toggle",
    name: "Prioritize Lobbies /w Friends",
    icon: "fa-solid fa-arrow-up",
    defaultValue: true,
  },
  {
    id: "prioritizeFriendsOnlyLobbies",
    category: "Steam Friends",
    type: "toggle",
    name: "Prioritize Friends Only Lobbies",
    icon: "fa-solid fa-arrow-up",
    defaultValue: true,
  },
  {
    id: "highlightFriends",
    category: "Steam Friends",
    type: "toggle",
    name: "Highlight Lobbies /w Friends",
    icon: "fa-solid fa-star",
    defaultValue: true,
  },
];

let types = [
  {
    type: "toggle",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("checkbox-wrapper");
      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("name", setting.name);
      input.setAttribute("id", getElemId(setting.id));
      if (value == "true" || value == true) input.setAttribute("checked", true);
      let old = input.checked;
      input.addEventListener("change", () => {
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: input.checked },
          }),
        );
        old = input.checked;
      });
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      fillLabel(setting, label);

      wrapper.appendChild(input);
      if (setting.displayLabel != false) wrapper.appendChild(label);
      return wrapper;
    },
    overrideCached: (value) => {
      if (value == "true" || value == true) return true;
      else return false;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const input = elem?.getElementsByTagName("input");
      if (input && input.length > 0) {
        let _val;
        if (val == "true" || val == true) _val = true;
        else _val = false;
        input[0].checked = _val;
      }
    },
  },
  {
    type: "select",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("selectWrapper");
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      label.classList.add("selectLabel");
      fillLabel(setting, label);
      if (setting.displayLabel != false) {
        wrapper.appendChild(label);
        const br = document.createElement("br");
        wrapper.appendChild(br);
      }

      const select = document.createElement("select");
      select.setAttribute("name", getElemId(setting.id));
      select.setAttribute("aria-label", setting.name);
      select.setAttribute("id", getElemId(setting.id));

      const btn = document.createElement("button");
      btn.appendChild(document.createElement("selectedcontent"));
      select.appendChild(btn);

      setting.values.forEach((val) => {
        const option = document.createElement("option");
        if (isString(val)) setOption(option, val, val);
        else setOption(option, val.id, val.name, val.icon);

        select.appendChild(option);
      });
      select.value = value;
      let old = select.value;
      select.addEventListener("change", () => {
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: select.value },
          }),
        );
        old = select.value;
      });

      wrapper.appendChild(select);
      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const input = elem?.getElementsByTagName("select");
      if (input && input.length > 0) input[0].value = val;
    },
  },
  {
    type: "search",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("searchWrapper");

      const icon = document.createElement("i");
      icon.setAttribute("class", setting.icon);

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = setting.name;
      input.id = getElemId(setting.id);
      input.value = value;

      let old = input.value;
      input.addEventListener("change", () => {
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: input.value },
          }),
        );
        old = input.value;
      });

      wrapper.appendChild(icon);
      wrapper.appendChild(input);
      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const input = elem?.getElementsByTagName("input");
      if (input && input.length > 0) input[0].value = val;
    },
  },
  {
    type: "range",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("rangeWrapper");

      const label = document.createElement("label");
      fillLabel(setting, label);
      if (setting.displayLabel != false) wrapper.appendChild(label);

      const container = document.createElement("div");
      container.classList.add("rangeInputs");
      wrapper.appendChild(container);

      const sliderBackground = document.createElement("div");
      sliderBackground.classList.add("sliderBackground");
      container.appendChild(sliderBackground);

      const sliderDiv = document.createElement("div");
      sliderDiv.classList.add("rangeSlider");
      sliderBackground.appendChild(sliderDiv);

      let min;
      let max;

      function sliderCallback() {
        if (!setting.baseName) setting.baseName = setting.name;
        const minVal = parseInt(min.value);
        const maxVal = parseInt(max.value);
        const n = `${setting.baseName} [${minVal} - ${maxVal}]`;
        setting.name = n;
        setSettingsTitle(setting.id, n);

        const left =
          ((minVal - setting.minValue) / (min.max - setting.minValue)) * 100;
        const right =
          100 -
          ((maxVal - setting.minValue) / (max.max - setting.minValue)) * 100;
        sliderDiv.style.left = `${left}%`;
        sliderDiv.style.right = `${right}%`;
      }

      function createSlider(_class, val, label = null) {
        if (!label) label = val;
        const slider = document.createElement("input");
        slider.setAttribute("aria-label", label);
        slider.type = "range";
        slider.classList.add(_class);
        slider.min = setting.minValue ?? 0;
        slider.max = setting.maxValue ?? 10;
        slider.step = setting.step ?? 1;
        slider.value = value[val];

        let old = value;

        slider.addEventListener("input", () => {
          sliderCallback();
          wrapper.dispatchEvent(
            new CustomEvent("onsettingchanged", {
              detail: {
                old: old,
                new: { min: parseInt(min.value), max: parseInt(max.value) },
              },
            }),
          );
          old = { min: parseInt(min.value), max: parseInt(max.value) };
        });
        return slider;
      }

      min = createSlider("minRange", "min", "Minimum Value");
      max = createSlider("maxRange", "max", "Maximum Value");

      container.appendChild(min);
      container.appendChild(max);

      sliderCallback();

      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      if (val.min && val.max) {
        const minInput = elem?.getElementsByClassName("minRange");
        if (minInput && minInput.length > 0) minInput[0].value = val.min;

        const maxInput = elem?.getElementsByClassName("maxRange");
        if (maxInput && maxInput.length > 0) maxInput[0].value = val.max;
      }
    },
  },
];

// Sort Order
// 1 - Descending
// 2 - Ascending

const categorySorts = [
  {
    name: "alphabetical",
    callback: (_settings, order) => {
      _settings.sort((a, b) =>
        (settings[a].baseName ?? settings[a].name)
          .toLowerCase()
          .localeCompare(
            (settings[b].baseName ?? settings[b].name).toLowerCase(),
          ),
      );
      if (order == 2) _settings.reverse();
      return _settings;
    },
  },
  {
    name: "filterTotalCount",
    callback: (_settings, order) => {
      _settings.sort(
        (a, b) =>
          parseInt(settings[b].totalCount ?? 0) -
          parseInt(settings[a].totalCount ?? 0),
      );
      if (order == 2) _settings.reverse();
      return _settings;
    },
  },
  {
    name: "filterCurrentCount",
    callback: (_settings, order) => {
      _settings.sort(
        (a, b) =>
          parseInt(settings[b].currCount ?? 0) -
          parseInt(settings[a].currCount ?? 0),
      );
      if (order == 2) _settings.reverse();
      return _settings;
    },
  },
];

let settingsValues = [];
let eventListeners = [];

let friendsLobbies = [];

function notice(
  div,
  title,
  description,
  icon = "fas fa-xmark",
  colorVariable = "--flb-gray-color",
) {
  const notices = div.getElementsByClassName("notice");
  if (notices && notices.length > 0) for (const n of notices) n.remove();

  const toCopy = document.getElementById("noticeToCopy");
  const notice = toCopy.cloneNode(true);
  notice.removeAttribute("id");
  const _icon = notice.getElementsByClassName("noticeIcon")[0];
  const _title = notice.getElementsByClassName("noticeTitle")[0];
  const _description = notice.getElementsByClassName("noticeDescription")[0];
  const classes = icon.split(" ");
  classes.forEach((x) => _icon.classList.add(x));
  _title.textContent = title;
  _description.textContent = description;
  notice.style.color = window
    .getComputedStyle(toCopy)
    .getPropertyValue(colorVariable);
  div.appendChild(notice);
}

function createToolTip(e, content, placement = "top") {
  if (e._tippy) e._tippy.setProps({ content: content });

  e._tippy = tippy(e, {
    content: content,
    animation: "scale",
    appendTo: "parent",
    interactive: true,
    placement: placement,
    allowHTML: true,
    theme: "website",
  });
}

function joinInfo(btn) {
  createToolTip(
    btn,
    'To join, you must have the <a class="modLink" href="https://github.com/FusionLobbyBrowser/Mod/releases/latest" target="_blank" rel="noopener noreferrer">mod</a> (>= 1.1.0 version) installed and have launched the game at least once since installation',
  );
}

async function requestJoin(code, platform) {
  const mapped = new Map(layers);
  const layer = mapped.get(platform);
  if (!layer) {
    console.error("An unmapped layer found, cannot join");
    return;
  }

  try {
    let encoded = btoa(JSON.stringify({ code: code, layer: layer }));

    encoded = encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/\=+$/, "");
    window.location.replace(URI_JOIN.replace("[data]", encoded));
  } catch (ex) {
    console.error(ex);
  }
}

export function setFriendsInLobby(friends) {
  friendsLobbies = friends;
  const order = [6, 1, 4, 2, 3, 0, 5];
  friendListElem.childNodes.forEach((x) => {
    const friend = friends.find((y) => y.id == x.getAttribute("steamid"));
    const additionalInfo = x.getElementsByClassName("steamAdditionalInfo")[0];
    const avatar = x.getElementsByClassName("friendAvatar")[0];
    const btnContainer = x.getElementsByClassName("buttonContainer")[0];
    let userStatus = -1;
    if (friend) {
      x.style.order = 0;
      additionalInfo.style.color = window
        .getComputedStyle(x)
        .getPropertyValue(`--flb-status6-color`);
      userStatus = 6;
      additionalInfo.innerHTML = `Playing in a lobby - ${friend.lobbyName}`;
      btnContainer.classList.remove("hidden");
      const joinBtn = x.getElementsByClassName("joinButton")[0];
      joinInfo(joinBtn);
      joinBtn.onclick = async () =>
        await requestJoin(friend.lobbyCode, friend.lobbyPlatform);
      const infoBtn = x.getElementsByClassName("infoButton")[0];
      infoBtn.onclick = () =>
        window.dispatchEvent(
          new CustomEvent("displayInfo", {
            detail: { lobbyID: friend.lobbyID },
          }),
        );
    } else if (x.hasAttribute("overridenInfo")) {
      userStatus = Number(x.getAttribute("userStatus"));
      additionalInfo.style.color = window
        .getComputedStyle(x)
        .getPropertyValue(`--flb-status${userStatus}-color`);
      x.style.order = order.findIndex((y) => y == userStatus) + 1;
      additionalInfo.textContent = x.getAttribute("infoText");
      btnContainer.classList.add("hidden");
    }

    if (userStatus != -1) {
      if (userStatus == 0) {
        x.classList.add("hidden");
        avatar.loading = "lazy";
        avatar.fetchpriority = "low";
      } else {
        x.classList.remove("hidden");
        avatar.loading = "eager";
        avatar.fetchpriority = "auto";
      }
    }
  });
}

function setOption(option, id, name, icon) {
  option.setAttribute("value", id ?? name);
  if (icon) {
    option.appendChild(getIconElem(icon));

    const content = document.createElement("span");
    content.classList.add("elemContent");
    content.textContent = name;
    option.appendChild(content);
  } else {
    option.textContent = name;
  }
}

function isString(val) {
  return typeof val === "string" || val instanceof String;
}

export function getIconElem(icon) {
  if (icon.startsWith("img:")) {
    const img = document.createElement("i");
    img.classList.add("gamemodeIcon");
    img.style.backgroundImage = `url(${icon.substring(4, icon.length)})`;
    return img;
  } else {
    const _icon = document.createElement("i");
    _icon.setAttribute("class", `textIcon ${icon}`);
    return _icon;
  }
}

function fillLabel(setting, elem) {
  if (setting.icon) {
    elem.appendChild(getIconElem(setting.icon));

    const content = document.createElement("span");
    content.classList.add("elemContent");
    content.textContent = setting.name;
    elem.appendChild(content);
  } else {
    elem.textContent = setting.name;
  }
}

function isGroup(lobby, array) {
  if (!lobby || !lobby.lobbyName || lobby.lobbyName == "") return false;

  const iName = Converter.removeRichText(lobby.lobbyName);
  const words = removeSymbols(iName).split(" ");
  for (const s of array) {
    if (!s) return;

    if (!s.includes(" ")) {
      for (const w of words) {
        if (w.toLowerCase() == removeSymbols(s).toLowerCase()) return true;
      }
    } else {
      if (removeSymbols(iName).toLowerCase().trim().includes(s.toLowerCase()))
        return true;
    }
  }

  return false;
}

function removeSymbols(text) {
  return text.replace(/[^a-zA-Z0-9]/gm, " ");
}

function createCategory(category) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("collapsable");
  wrapper.classList.add("settingsCategory");
  wrapper.setAttribute("id", getCategoryId(category));
  const button = document.createElement("button");
  button.classList.add("textButton");
  if (category.expanded) button.classList.add("collapsed");
  button.addEventListener("click", () => {
    button.classList.toggle("collapsed");
  });
  const title = document.createElement("h2");
  title.innerHTML = getCategoryText(category);
  const div = document.createElement("div");

  wrapper.appendChild(button);
  button.appendChild(title);
  wrapper.appendChild(div);

  return wrapper;
}

function setContent(elem, content) {
  const contents = elem.getElementsByClassName("elemContent");
  if (contents && contents.length > 0) {
    const span = contents[0];
    if (span) {
      span.textContent = content;
      return;
    }
  }

  elem.textContent = content;
}

export function init() {
  const settingsList = document.getElementById("settingsList");
  settingsList.replaceChildren();

  categories.forEach((val) => {
    const cat = createCategory(val);
    settingsList.appendChild(cat);
    if (!val.customHandler) {
      fillCategory(val);
    } else {
      val.customHandler(cat);
    }
  });
}

function fillCategory(val) {
  let index = [];
  settings.forEach((x, i) => {
    if (x.category == val.name) index.push(i);
  });
  if (val.sort && val.sortMode) {
    const order = categorySorts.find(
      (x) => x.name.toLowerCase() == val.sortMode.toLowerCase(),
    );
    if (order) index = order.callback(index, val.sortOrder);
  }

  for (const i of index) {
    const val = settings[i];
    createSetting(val);
  }
}

function createSetting(val) {
  const settingsList = document.getElementById("settingsList");
  const type = types.find((t) => t.type == val.type);
  if (type == null) {
    console.warn(`Setting '${val.id}' has unknown type: ${val.type}`);
    return;
  }

  const saved = localStorage.getItem(getElemId(val.id));
  let _val;
  if (saved != null && saved != undefined) {
    try {
      if (!type.overrideCached)
        _val = val.storeAsJSON ? JSON.parse(saved) : saved;
      else _val = type.overrideCached(saved);
    } catch (ex) {
      console.error(
        "Failed to load value from storage, fallback to default (the stored one will be overwritten!)",
      );
      console.error(ex);
      _val = val.defaultValue;
    }
  } else {
    if (typeof val.defaultValue == "function") _val = val.defaultValue();
    else _val = val.defaultValue;
  }
  if (!val.initialValueSet) {
    setSetting(val.id, _val);
    val.initialValueSet = true;
  }

  const category = settingsList
    .querySelector(
      `#${getCategoryId(categories.find((x) => x.name == val.category))}`,
    )
    ?.getElementsByTagName("div")[0];
  if (category == null) {
    console.warn(`Setting '${val.id}' has unknown category: ${val.category}`);
    return;
  }

  const wrapper = type.callback(val, _val);
  if (wrapper == null) {
    console.warn(`Empty wrapper for setting '${val.id}'`);
    return;
  }

  val.elem = wrapper;

  wrapper.addEventListener("onsettingchanged", (v) =>
    setSetting(val.id, v.detail.new, v.detail.old),
  );

  category.appendChild(wrapper);
}

export function setSetting(setting, value, old = null) {
  let index = settingsValues.findIndex((x) => x.id == setting);
  if (index == -1 || settingsValues[index].value != value) {
    const s = getSetting(setting);
    if (!s) return;

    if (s.saveToStorage != false)
      localStorage.setItem(
        getElemId(setting),
        s.storeAsJSON ? JSON.stringify(value) : value,
      );
    if (index != -1) settingsValues[index].value = value;
    else settingsValues.push({ id: setting, value: value });

    eventListeners.forEach((x) => {
      if (x.id == setting) x.callback(value);
    });

    const type = types.find((t) => t.type == s.type);
    if (type && type.setValue) type.setValue(s.elem, value);

    window.dispatchEvent(
      new CustomEvent("onsettingchanged", {
        detail: { id: setting, old: old, new: value },
      }),
    );
  }
}

export function getSettingValue(setting) {
  let index = settingsValues.findIndex((x) => x.id == setting);
  if (index != -1) return settingsValues[index].value;
  else return undefined;
}

export function getSetting(setting) {
  let index = settings.findIndex((x) => x.id == setting);
  if (index != -1) return settings[index];
  else return undefined;
}

export function setSettingsTitle(setting, title) {
  let index = settings.findIndex((x) => x.id == setting);
  if (index != -1) {
    const val = settings[index];
    if (!val.elem) return;
    settings[index].name = title;
    const type = types.find((t) => t.type == val.type);
    if (type && type.setTitle) type.setTitle(val.elem, title);
  }
}

export function addCategory(category) {
  if (!category || categories.find((x) => x.name == category.name)) return;
  categories.push(category);
  init();
}

export function removeCategory(categoryName) {
  if (!categoryName || !categories.find((x) => x.name == categoryName)) return;
  categories = categories.filter((x) => x.name != categoryName);
  init();
}

export function addSetting(setting) {
  if (!setting || settings.find((x) => x.id == setting.id)) return;
  settings.push(setting);
  init();
}

export function removeSetting(settingId) {
  if (!settingId || !settings.find((x) => x.id == settingId)) return;
  settings = settings.filter((x) => x.id != settingId);
  init();
}

export function filterWithSettings(lobbies) {
  const constValue = structuredClone(lobbies);
  for (const setting of settings) {
    if (!setting || !setting.lobbyFilter) continue;

    if (!setting.filterWords && !setting.lobbyValidator) continue;
    let filter = false;

    const val = getSettingValue(setting.id);
    if (typeof setting.filterValue == "function")
      filter = setting.filterValue(setting, val);
    else filter = setting.filterValue == val;

    if (filter) lobbies = lobbies.filter((i) => !isLobbyValid(setting, i));
  }

  for (const setting of settings) {
    if (!setting || !setting.lobbyFilter) continue;

    let total = 0;
    let curr = 0;

    if (!setting.filterWords && !setting.lobbyValidator) continue;

    if (setting.setFilterName != false) {
      constValue.forEach((element) => {
        if (isLobbyValid(setting, element)) total++;
      });

      lobbies.forEach((element) => {
        if (isLobbyValid(setting, element)) curr++;
      });
    }

    setting.totalCount = total;
    setting.currCount = curr;

    if (!setting.baseName) setting.baseName = setting.name;
    if (setting.setFilterName != false)
      setSettingsTitle(
        setting.id,
        `${setting.baseName} [${total == curr ? total : `${curr}/${total}`}]`,
      );
  }

  return lobbies;
}

// This is in reverse
export function isLobbyValid(setting, i) {
  if (isString(setting)) setting = getSetting(setting);
  if (!setting) return true;
  let valid = true;

  if (setting.filterWords && isGroup(i, setting.filterWords)) valid = false;
  if (
    setting.lobbyValidator &&
    setting.lobbyValidator(i, getSettingValue(setting.id))
  )
    valid = false;

  if (setting.filterLevels && setting.filterLevels.includes(i.levelBarcode))
    valid = false;

  return !valid;
}

export function addEventListener(id, callback) {
  eventListeners.push({ id: id, callback: callback });
}

function getElemId(setting) {
  return `setting_${setting}`;
}

function getCategoryText(category) {
  return `<i class="${category.icon} textIcon"></i>${category.name}`;
}

function getCategoryId(category) {
  return `category_${category?.name?.replace(" ", "")}`;
}
