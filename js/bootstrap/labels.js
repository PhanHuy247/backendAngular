(function (namespace) {
    namespace.LabelManager = function (translate) {
        this.translate = translate;
        this.attributes = {
            userTypes: [{
                value: 0,
                label: this.translate('USER.INFO.EMAIL')
            }, {
                value: 1,
                label: this.translate('USER.INFO.FACEBOOK_ID')
            }
                //                {
                //                    value : 2,
                //                    label : this.translate('USER.INFO.MOCOM_ID')
                //                },
                //                {
                //                    value : 3,
                //                    label : this.translate('USER.INFO.FAMU_ID')
                //                }
            ],
            lisLogs: [{
                value: 0,
                label: this.translate('LOG.USER_INFO.LB_PENDING')
            }, {
                value: 1,
                label: this.translate('LOG.USER_INFO.LB_APPROVED')
            }, {
                value: -1,
                label: this.translate('LOG.USER_INFO.LB_DENIED')
            }, {
                value: 2,
                label: this.translate('LOG.USER_INFO.LB_ALL')
            }],
            registerTypes: [{
                value: 0,
                label: this.translate('SETTINGS.NEWS.BEFORE')
            },
            {
                value: 1,
                label: this.translate('SETTINGS.NEWS.AFTER')
            },
            {
                value: 2,
                label: this.translate('SETTINGS.NEWS.FROM_TO')
            }
            ],
            imageTypes: [{
                value: 1,
                label: this.translate('IMAGE.PUBLIC')
            }, /* {
                value: 2,
                label: this.translate('IMAGE.BACKSTAGE')
            } */],
            genders: [{
                value: 0,
                label: this.translate('USER.INFO.MALE')
            }, {
                value: 1,
                label: this.translate('USER.INFO.FEMALE')
            }],
            deviceType: [{
                value: 0,
                label: this.translate('USER.INFO.IOS_DEVICE')
            }, {
                value: 1,
                label: this.translate('USER.INFO.ANDROID_DEVICE')
            }],
            job: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_JOB.CEO')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_JOB.STUDENT')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_JOB.OFFICE_LADY')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_JOB.PART_TIMER')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_JOB.NURSE')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_JOB.BABYSISTER')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_JOB.SHOP_ASSISTATNT')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_JOB.MODEL')
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_JOB.TEACHER')
            }, {
                value: 9,
                label: this.translate('USER.PROPERTY.SELECT_JOB.HOMEMAKER')
            }, {
                value: 10,
                label: this.translate('USER.PROPERTY.SELECT_JOB.HOUSEWIFE')
            }, {
                value: 11,
                label: this.translate('USER.PROPERTY.SELECT_JOB.FOOD_SUPPLIER')
            }, {
                value: 12,
                label: this.translate('USER.PROPERTY.SELECT_JOB.CLOTHES')
            }, {
                value: 13,
                label: this.translate('USER.PROPERTY.SELECT_JOB.SALON_STAFF')
            }, {
                value: 14,
                label: this.translate('USER.PROPERTY.SELECT_JOB.AIR_HOSTESS')
            }, {
                value: 15,
                label: this.translate('USER.PROPERTY.SELECT_JOB.SECRET')
            }, {
                value: 16,
                label: this.translate('USER.PROPERTY.SELECT_JOB.OTHERS')
            }, {
                value: 17,
                label: this.translate('USER.PROPERTY.SELECT_JOB.OFFICE_WORKER')
            }, {
                value: 18,
                label: this.translate('USER.PROPERTY.SELECT_JOB.MANAGER')
            }, {
                value: 19,
                label: this.translate('USER.PROPERTY.SELECT_JOB.SALES_MANAGEMENT')
            }, {
                value: 20,
                label: this.translate('USER.PROPERTY.SELECT_JOB.PART_TIMER')
            }, {
                value: 21,
                label: this.translate('USER.PROPERTY.SELECT_JOB.STUDENT')
            }, {
                value: 22,
                label: this.translate('USER.PROPERTY.SELECT_JOB.SERVICE_INDUSTRY')
            }, {
                value: 23,
                label: this.translate('USER.PROPERTY.SELECT_JOB.ENGINEER')
            }, {
                value: 24,
                label: this.translate('USER.PROPERTY.SELECT_JOB.CONSTRUCTION')
            }, {
                value: 25,
                label: this.translate('USER.PROPERTY.SELECT_JOB.TRANSPORTATION')
            }, {
                value: 26,
                label: this.translate('USER.PROPERTY.SELECT_JOB.FINANCE')
            }, {
                value: 27,
                label: this.translate('USER.PROPERTY.SELECT_JOB.REAL_ESTATE')
            }, {
                value: 28,
                label: this.translate('USER.PROPERTY.SELECT_JOB.LAW')
            }, {
                value: 29,
                label: this.translate('USER.PROPERTY.SELECT_JOB.IT')

            }, {
                value: 30,
                label: this.translate('USER.PROPERTY.SELECT_JOB.NURSE')
            }, {
                value: 31,
                label: this.translate('USER.PROPERTY.SELECT_JOB.EDUCATION')
            }, {
                value: 32,
                label: this.translate('USER.PROPERTY.SELECT_JOB.PUBLIC_WELFARE')
            }, {
                value: 33,
                label: this.translate('USER.PROPERTY.SELECT_JOB.CLOTHES')
            }, {
                value: 34,
                label: this.translate('USER.PROPERTY.SELECT_JOB.ENTERTAIMENT')
            }, {
                value: 35,
                label: this.translate('USER.PROPERTY.SELECT_JOB.ART')
            }, {
                value: 36,
                label: this.translate('USER.PROPERTY.SELECT_JOB.UNEMPLOYED')
            }, {
                value: 37,
                label: this.translate('USER.PROPERTY.SELECT_JOB.OTHERS')
            }, {
                value: 38,
                label: this.translate('USER.PROPERTY.SELECT_JOB.SECRET')
            }],
            //body_type
            body_type: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.THIN') // 'Gầy'
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.SLIGHT_BUILT') //'Hơi gầy'
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.SHORT') //'Thấp'
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.NORMAL') //'Bình thường'
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.CONFIDENT') // 'Tự tin'
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.CHARMING') // 'Quyến rũ'
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.PLUMP') // 'Hơi béo'
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.FAT') // 'Béo' //female
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.SLIM') //'Mảnh khảnh'
            }, {
                value: 9,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.SLENDER') //'Hơi mảnh khảnh'
            }, {
                value: 10,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.TONED') // 'Săn chắc'
            }, {
                value: 11,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.NORMAL') //'Bình thường'
            }, {
                value: 12,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.MUSCULAR') // 'Cơ bắp'
            }, {
                value: 13,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.SPORTY') //'Dáng thể thao'
            }, {
                value: 14,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.PLUMP') // 'Hơi béo'
            }, {
                value: 15,
                label: this.translate('USER.PROPERTY.SELECT_BODY_TYPE.FAT') // 'Béo'
            }],
            interestedIn: [{
                value: 2,
                label: this.translate('USER.INFO.OTHER')
            }, {
                value: 0,
                label: this.translate('USER.INFO.MALE')
            }, {
                value: 1,
                label: this.translate('USER.INFO.FEMALE')
            }],
            orderBys: [{
                value: -1,
                label: this.translate('FORM.DESC')
            }, {
                value: 1,
                label: this.translate('FORM.ASC')
            }],
            by_user_type: [{
                value: 2,
                label: this.translate('FORM.BOTH')
            }, {
                value: 1,
                label: this.translate('FORM.OWNER')
            }, {
                value: 0,
                label: this.translate('FORM.RECIPIENT')
            }],
            isPurchase: [{
                value: 2,
                label: this.translate('FORM.BOTH')
            }, {
                value: 0,
                label: this.translate('FORM.NO')
            }, {
                value: 1,
                label: this.translate('FORM.YES')
            }],
            region: [{
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HA_NOI')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BAC_NINH')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HA_NAM')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HAI_DUONG')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HAI_PHONG')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HUNG_YEN')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_REGION.NAM_DINH')
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_REGION.NINH_BINH')
            }, {
                value: 9,
                label: this.translate('USER.PROPERTY.SELECT_REGION.THAI_BINH')
            }, {
                value: 10,
                label: this.translate('USER.PROPERTY.SELECT_REGION.VINH_PHUC')
            }, {
                value: 11,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HA_GIANG')
            }, {
                value: 12,
                label: this.translate('USER.PROPERTY.SELECT_REGION.CAO_BANG')
            }, {
                value: 13,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BAC_KAN')
            }, {
                value: 14,
                label: this.translate('USER.PROPERTY.SELECT_REGION.LANG_SON')
            }, {
                value: 15,
                label: this.translate('USER.PROPERTY.SELECT_REGION.TUYEN_QUANG')
            }, {
                value: 16,
                label: this.translate('USER.PROPERTY.SELECT_REGION.THAI_NGUYEN')
            }, {
                value: 17,
                label: this.translate('USER.PROPERTY.SELECT_REGION.PHU_THO')
            }, {
                value: 18,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BAC_GIANG')
            }, {
                value: 19,
                label: this.translate('USER.PROPERTY.SELECT_REGION.QUANG_NINH')
            }, {
                value: 20,
                label: this.translate('USER.PROPERTY.SELECT_REGION.LAO_CAI')
            }, {
                value: 21,
                label: this.translate('USER.PROPERTY.SELECT_REGION.YEN_BAI')
            }, {
                value: 22,
                label: this.translate('USER.PROPERTY.SELECT_REGION.DIEN_BIEN')
            }, {
                value: 23,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HOA_BINH')
            }, {
                value: 24,
                label: this.translate('USER.PROPERTY.SELECT_REGION.LAI_CHAU')
            }, {
                value: 25,
                label: this.translate('USER.PROPERTY.SELECT_REGION.SON_LA')
            }, {
                value: 26,
                label: this.translate('USER.PROPERTY.SELECT_REGION.THANH_HOA')
            }, {
                value: 27,
                label: this.translate('USER.PROPERTY.SELECT_REGION.NGHE_AN')
            }, {
                value: 28,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HA_TINH')
            }, {
                value: 29,
                label: this.translate('USER.PROPERTY.SELECT_REGION.QUANG_BINH')
            }, {
                value: 30,
                label: this.translate('USER.PROPERTY.SELECT_REGION.QUANG_TRI')
            }, {
                value: 31,
                label: this.translate('USER.PROPERTY.SELECT_REGION.THUA_THIEN_HUE')
            }, {
                value: 32,
                label: this.translate('USER.PROPERTY.SELECT_REGION.DA_NANG')
            }, {
                value: 33,
                label: this.translate('USER.PROPERTY.SELECT_REGION.QUANG_NAM')
            }, {
                value: 34,
                label: this.translate('USER.PROPERTY.SELECT_REGION.QUANG_NGAI')
            }, {
                value: 35,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BINH_DINH')
            }, {
                value: 36,
                label: this.translate('USER.PROPERTY.SELECT_REGION.PHU_YEN')
            }, {
                value: 37,
                label: this.translate('USER.PROPERTY.SELECT_REGION.KHANH_HOA')
            }, {
                value: 38,
                label: this.translate('USER.PROPERTY.SELECT_REGION.NINH_THUAN')
            }, {
                value: 39,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BINH_THUAN')
            }, {
                value: 40,
                label: this.translate('USER.PROPERTY.SELECT_REGION.KON_TUM')
            }, {
                value: 41,
                label: this.translate('USER.PROPERTY.SELECT_REGION.GIA_LAI')
            }, {
                value: 42,
                label: this.translate('USER.PROPERTY.SELECT_REGION.DAC_LAC')
            }, {
                value: 43,
                label: this.translate('USER.PROPERTY.SELECT_REGION.DAC_NONG')
            }, {
                value: 44,
                label: this.translate('USER.PROPERTY.SELECT_REGION.LAM_DONG')
            }, {
                value: 45,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HO_CHI_MINH')
            }, {
                value: 46,
                label: this.translate('USER.PROPERTY.SELECT_REGION.CAN_THO')
            }, {
                value: 47,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BINH_PHUOC')
            }, {
                value: 48,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BINH_DUONG')
            }, {
                value: 49,
                label: this.translate('USER.PROPERTY.SELECT_REGION.DONG_NAI')
            }, {
                value: 50,
                label: this.translate('USER.PROPERTY.SELECT_REGION.TAY_NINH')
            }, {
                value: 51,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BA_RIA')
            }, {
                value: 52,
                label: this.translate('USER.PROPERTY.SELECT_REGION.LONG_AN')
            }, {
                value: 53,
                label: this.translate('USER.PROPERTY.SELECT_REGION.DONG_THAP')
            }, {
                value: 54,
                label: this.translate('USER.PROPERTY.SELECT_REGION.TIEN_GIANG')
            }, {
                value: 55,
                label: this.translate('USER.PROPERTY.SELECT_REGION.AN_GIANG')
            }, {
                value: 56,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BEN_TRE')
            }, {
                value: 57,
                label: this.translate('USER.PROPERTY.SELECT_REGION.VINH_LONG')
            }, {
                value: 58,
                label: this.translate('USER.PROPERTY.SELECT_REGION.TRA_VINH')
            }, {
                value: 59,
                label: this.translate('USER.PROPERTY.SELECT_REGION.HAU_GIANG')
            }, {
                value: 60,
                label: this.translate('USER.PROPERTY.SELECT_REGION.KIEN_GIANG')
            }, {
                value: 61,
                label: this.translate('USER.PROPERTY.SELECT_REGION.SOC_TRANG')
            }, {
                value: 62,
                label: this.translate('USER.PROPERTY.SELECT_REGION.BAC_LIEU')
            }, {
                value: 63,
                label: this.translate('USER.PROPERTY.SELECT_REGION.CA_MAU')
            }],
            reportTypes: [{
                value: 1,
                label: this.translate('REPORT.COMMON_USER_IMAGE.REPORT_TYPE.VIOLENT_CONTENT')
            }, {
                value: 2,
                label: this.translate('REPORT.COMMON_USER_IMAGE.REPORT_TYPE.HATEFUL_CONTENT')
            }, {
                value: 3,
                label: this.translate('REPORT.COMMON_USER_IMAGE.REPORT_TYPE.DANGEROUS_CONTENT')
            }, {
                value: 4,
                label: this.translate('REPORT.COMMON_USER_IMAGE.REPORT_TYPE.COPYRIGHTED_CONTENT')
            }
                /*, {
                                 value : 5,
                                 label : this.translate('REPORT.COMMON_USER_IMAGE.REPORT_TYPE.SPAM_OR_SCAM')
                                 }, {
                                 value : 6,
                                 label : this.translate('REPORT.COMMON_USER_IMAGE.REPORT_TYPE.UNDERAGER_CONTENT')
                                 } */
            ],
            status: [{
                value: 1,
                label: this.translate('FORM.ENABLE')
            }, {
                value: 0,
                label: this.translate('FORM.DISABLE')
            }],
            trackUrl: [{
                value: 0,
                label: this.translate('CM_CODE_COMMON.TRACK_URL_TYPE_API')
            }, {
                value: 1,
                label: this.translate('CM_CODE_COMMON.TRACK_URL_TYPE_IMG')
            }],
            bodyTypes: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.SLIM')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.PETITE')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.SLENDER')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.NORMAL')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.MOREOFLOVE')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.CURVY')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.SWIMBUILD')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.MUSCULAR')
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.SKINNY')
            }, {
                value: 9,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.TALL')
            }, {
                value: 10,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.ALTHLETIC')
            }, {
                value: 11,
                label: this.translate('USER.PROPERTY.SELECT_BDY_TPE.LARGEANDSOLID')
            }],
            lookingFor: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_LKG_FOR.FRIENDS')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_LKG_FOR.FLIRTING')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_LKG_FOR.FUN')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_LKG_FOR.DATING')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_LKG_FOR.CHAT')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_LKG_FOR.PARTY')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_LKG_FOR.RELATIONSHIP')
            }],
            interests: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.MOVIE')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.BOOK')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.TV')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.MUSIC')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.FAMILY')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.PETS')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.DRINKING')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.RESTAURANT')
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.SHOPPING')
            }, {
                value: 9,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.WATCHING_SPOT')
            }, {
                value: 10,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.PLAYING_SPOT')
            }, {
                value: 11,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.BARS')
            }, {
                value: 12,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.DANCING')
            }, {
                value: 13,
                label: this.translate('USER.PROPERTY.SELECT_INTERES.GAMES')
            }],
            relationshipStatuses: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.SINGLE')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.IN_A_RELATIONSHIP')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.MARRIED')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.IT_COMPLICATE')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.IN_AN_OPEN_RELATIONSHIP')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.SEPARATED')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.DEVORCED')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_RELSH_STT.IN_A_CIVIL_UNION')
            }],
            userStatuses: [{
                value: -1,
                label: this.translate('USER.PROPERTY.SELECT_FLAG.DISABLE')
            }, {
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_FLAG.DEACTIVE')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_FLAG.ACTIVE')
            }],
            ethnicities: [{
                value: -1,
                label: this.translate('FORM.ASK_ME')
            }, {
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_ETH.LATINA_LATINO')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_ETH.BLACK_AFICAN')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_ETH.NATIVE_ABORIGINAL')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_ETH.ASIAN')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_ETH.EAST_INDIAN')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_ETH.PACIFIC')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_ETH.WHITE_CAUCASIAN')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_ETH.MIDDLE_EASTER')
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_ETH.MIXED_MULTI')
            }],
            logReasons: [{
                label: this.translate('LOG.POINT.SELECT.REGISTER'),
                value: 1,
                name: 'LOG.POINT.SELECT.REGISTER'
            }, {
                label: this.translate('LOG.POINT.SELECT.DAILY_BONUS'),
                value: 2,
                name: 'LOG.POINT.SELECT.DAILY_BONUS'
            }, {
                label: this.translate('LOG.POINT.SELECT.CASH'),
                value: 4,
                name: 'LOG.POINT.SELECT.CASH'
            }, {
                label: this.translate('LOG.POINT.SELECT.BULD_ADD_POINT'),
                value: 49,
                name: 'LOG.POINT.SELECT.BULD_ADD_POINT'
            }, {
                label: this.translate('LOG.POINT.SELECT.UNLOCKED_BST'),
                value: 5,
                name: 'LOG.POINT.SELECT.XXX_UNLOCKED_BACKSTAGE'
            }, {
                label: this.translate('LOG.POINT.SELECT.UNLOCK_BST_XXX'),
                value: 8,
                name: 'LOG.POINT.SELECT.UNLOCK_BACKSTAGE_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.SAVE_IMG'),
                value: 9,
                name: 'LOG.POINT.SELECT.SAVE_IMG_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.SEND_GIFT'),
                value: 11,
                name: 'LOG.POINT.SELECT.SEND_GIFT_TO_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.ONLINE_ALERT'),
                value: 12,
                name: 'LOG.POINT.SELECT.ONLINE_ALERT_BY_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.ADMINISTRATOR'),
                value: 14,
                name: 'LOG.POINT.SELECT.ADMINISTRATOR'
            }, {
                label: this.translate('LOG.POINT.SELECT.VOICE_CALL_TO_NAME'),
                value: 15,
                name: 'LOG.POINT.SELECT.VOICE_CALL_TO_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.VIDEO_CALL_TO_NAME'),
                value: 16,
                name: 'LOG.POINT.SELECT.VIDEO_CALL_TO_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.CHAT_TO_NAME'),
                value: 17,
                name: 'LOG.POINT.SELECT.CHAT_TO_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.BUY_STICKER'),
                value: 18,
                name: 'LOG.POINT.SELECT.BUY_STICKER'
            },
            /* {
                            label : this.translate('LOG.POINT.SELECT.WINK_TO_NAME'),
                            value : 19,
                            name : 'LOG.POINT.SELECT.WINK_TO_XXX'
                            },*/
            {
                label: this.translate('LOG.POINT.SELECT.REC_GIFT'),
                value: 22,
                name: 'LOG.POINT.SELECT.REC_GIFT'
            }, {
                label: this.translate('LOG.POINT.SELECT.SAVE_IMAGE_BONUS'),
                value: 25,
                name: 'LOG.POINT.SELECT.SAVE_IMAGE_BONUS_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.ADVERTSEMENT'),
                value: 26
            },
            /* {
                            label : this.translate('LOG.POINT.SELECT.RECEIVE_WINK'),
                            value : 36,
                            name : 'LOG.POINT.SELECT.RECEIVE_WINK_XXX'
                            },*/
            {
                label: this.translate('LOG.POINT.SELECT.RECEIVE_CHAT'),
                value: 37,
                name: 'LOG.POINT.SELECT.RECEIVE_CHAT_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.TRADEPOINT_TO_MONEY'),
                value: 38
            }, {
                label: this.translate('LOG.POINT.SELECT.COMMENT_ON_BUZZ'),
                value: 39,
                name: 'LOG.POINT.SELECT.XXX_COMMENT_ON_BUZZ'
            }, {
                label: this.translate('LOG.POINT.SELECT.COMMENT_YOUR_BUZZ'),
                value: 40,
                name: 'LOG.POINT.SELECT.XXX_COMMENT_YOUR_BUZZ'
            }, {
                label: this.translate('LOG.POINT.SELECT.ADD_FREE_POINT_FROM_LB_XXX'),
                value: 41,
                name: 'LOG.POINT.SELECT.ADD_FREE_POINT_FROM_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.ADD_POINT_BY_LB_XXX'),
                value: 42,
                name: 'LOG.POINT.SELECT.ADD_POINT_BY_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.VIEW_IMAGE_OF_XXX_LB'),
                value: 43,
                name: 'LOG.POINT.SELECT.VIEW_IMAGE_OF_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.XXX_VIEW_YOUR_IMAGE_LB'),
                value: 44,
                name: 'LOG.POINT.SELECT.XXX_VIEW_YOUR_IMAGE'
            }, {
                label: this.translate('LOG.POINT.SELECT.WATCH_VIDEO_OF_XXX_LB'),
                value: 45,
                name: 'LOG.POINT.SELECT.WATCH_VIDEO_OF_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.XXX_WATCH_YOUR_VIDEO_LB'),
                value: 46,
                name: 'LOG.POINT.SELECT.XXX_WATCH_YOUR_VIDEO'
            }, {
                label: this.translate('LOG.POINT.SELECT.LISTEN_AUDIO_OF_XXX_LB'),
                value: 47,
                name: 'LOG.POINT.SELECT.LISTEN_AUDIO_OF_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.XXX_LISTEN_YOUR_AUDIO_LB'),
                value: 48,
                name: 'LOG.POINT.SELECT.XXX_LISTEN_YOUR_AUDIO'
            }, {
                label: this.translate('LOG.POINT.SELECT.YOU_REPLIED_COMMENT_OF_XXX_LB'),
                value: 50,
                name: 'LOG.POINT.SELECT.YOU_REPLIED_COMMENT_OF_XXX'
            }, {
                label: this.translate('LOG.POINT.SELECT.XXX_REPLIED_YOUR_COMMENT_LB'),
                value: 51,
                name: 'LOG.POINT.SELECT.XXX_REPLIED_YOUR_COMMENT'
            }, {
                label: this.translate('LOG.POINT.SELECT.REPAY_POINT_LB'),
                value: 52,
                name: 'LOG.POINT.SELECT.REPAY_POINT'
            }
            ],
            //            saleType: [
            //                {
            //                    label: this.translate('LOG.POINT.SELECT.CREDIT'),
            //                    value: 0
            //                }, {
            //                    label: this.translate('LOG.POINT.SELECT.BISCASH'),
            //                    value: 1
            //                }, {
            //                    label: this.translate('LOG.POINT.SELECT.POINT_BACK'),
            //                    value: 2
            //                }, {
            //                    label: this.translate('LOG.POINT.SELECT.C_CHECK'),
            //                    value: 3
            //                }, {
            //                    label: this.translate('LOG.POINT.SELECT.COBONI'),
            //                    value: 4
            //                }
            //            ],

            saleType: [{
                value: 0,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.APPLE')
            }, {
                value: 1,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.GOOGLE')
            }, {
                value: 2,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.CREDIT_CARD')
            }, {
                value: 3,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.BITCACH')
            }, {
                value: 4,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.CONVENIENCE')
            }, {
                value: 5,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.POINTS_BACK')
            }, {
                value: 6,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.CCHECK')
            }],
            cuteType: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.DECENT')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.GRACEFUL')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.CHILDLIKE')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.WARM')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.PRETTY')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.ADORABLE')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.GIRLY')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.HUMOROUS')
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.NATURAL')
            }, {
                value: 9,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.OLEDER_SISTER')
            }, {
                value: 10,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.YOUNGER_SISTER')
            }, {
                value: 11,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.EXQUISITE')
            }, {
                value: 12,
                label: this.translate('USER.PROPERTY.SELECT_CUTE_TYPE.SECRET')
            }],
            cup: [{
                value: 0,
                label: 'A'
            }, {
                value: 1,
                label: 'B'
            }, {
                value: 2,
                label: 'C'
            }, {
                value: 3,
                label: 'D'
            }, {
                value: 4,
                label: 'E'
            }, {
                value: 5,
                label: 'F'
            }, {
                value: 6,
                label: 'G'
            }, {
                value: 7,
                label: 'H'
            }, {
                value: 8,
                label: 'I'
            }],
            joinHours: [{
                value: 0,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.MORNING')
            }, {
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.MORINING_NOON')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.NOON')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.NOON_NIGHT')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.NIGHT_MORNING')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.FLUCTUATE')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.CALL_EMAIL')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_JOIN_HOURS.SECRET')
            }],
            verificationFlag: [{
                value: -2,
                label: this.translate('REPORT.APPROVE_DENY_IMAGE.NONE')
            }, {
                value: -1,
                label: this.translate('REPORT.APPROVE_DENY_IMAGE.DENIED')
            }, {
                value: 0,
                label: this.translate('REPORT.APPROVE_DENY_IMAGE.PENDING')
            }, {
                value: 1,
                label: this.translate('USER.USER_LIST.VALUE_VERIFIED')
            }],
            videoCallWaiting: [{
                value: false,
                label: this.translate('FORM.NO')
            }, {
                value: true,
                label: this.translate('FORM.YES')
            }],
            userCall: [{
                value: false,
                label: this.translate('FORM.NO')
            }, {
                value: true,
                label: this.translate('FORM.YES')
            }],
            noTypes: [{
                value: 4,
                label: this.translate('LOG.NOTIFICATION.XXX_FAVORITE', {
                    name: name
                })
            }, {
                value: 5,
                label: this.translate('LOG.NOTIFICATION.XXX_LIKED', {
                    name: name
                })
            }, {
                value: 7,
                label: this.translate('LOG.NOTIFICATION.XXX_RESPONSED_YOUR_BUZZ', {
                    name: name
                })
            }, {
                value: 11,
                label: this.translate('LOG.NOTIFICATION.XXX_CHAT_WITH_YOU', {
                    name: name
                })
            }, {
                value: 12,
                label: this.translate('LOG.NOTIFICATION.XXX_BECAME_ONLINE', {
                    name: name
                })
            }, {
                value: 13,
                label: this.translate('LOG.NOTIFICATION.YOU_EARN_DAILY_BONUS')
            }, {
                value: 15,
                label: this.translate('LOG.NOTIFICATION.YOUR_BUZZ_IS_APPROVED')
            }, {
                value: 16,
                label: this.translate('LOG.NOTIFICATION.YOUR_BACKSTAGE')
            }, {
                value: 18,
                label: this.translate('LOG.NOTIFICATION.ADMINISTRATOR_SEND_NOTIFICATION', {
                    name: name
                })
            }, {
                value: 19,
                label: this.translate('LOG.NOTIFICATION.XXX_POST_NEW_BUZZ', {
                    name: name
                })
            }, {
                value: 20,
                label: this.translate('LOG.YOU_HAVE_REPLIED_IN_TIMELINE')
            }, {
                value: 21,
                label: this.translate('LOG.YOUR_BUZZ_WAS_DENIED')
            }, {
                value: 22,
                label: this.translate('LOG.YOUR_BACKSTAGE_WAS_DENIED')
            }, {
                value: 24,
                label: this.translate('LOG.YOUR_TEXT_BUZZ_WAS_APPROVED')
            }, {
                value: 25,
                label: this.translate('LOG.YOUR_TEXT_BUZZ_WAS_DENIED')
            }, {
                value: 26,
                label: this.translate('LOG.YOUR_COMMENT_WAS_APPROVED')
            }, {
                value: 27,
                label: this.translate('LOG.YOUR_COMMENT_WAS_DENIED')
            }, {
                value: 28,
                label: this.translate('LOG.YOUR_REPLY_OF_COMMENT_WAS_APPROVED')
            }, {
                value: 29,
                label: this.translate('LOG.YOUR_REPPLY_OF_COMMENT_WAS_DENIED')
            }, {
                value: 30,
                label: this.translate('LOG.YOUR_PROFILE_WAS_APPROVED')
            }, {
                value: 31,
                label: this.translate('LOG.SOME_INFO_OF_YOUR_PROFILE_WAS_DENIED')
            }, {
                value: 32,
                label: this.translate('LOG.YOUR_PROFILE_WAS_DENIED')
            }],
            site_id: [{
                value: 0,
                label: this.translate('USER.INFO.SITE_ID.DEFAULT')
            }, {
                value: 1,
                label: this.translate('USER.INFO.SITE_ID.CREA')
            }, {
                value: 2,
                label: this.translate('USER.INFO.SITE_ID.GRAN')
            }, {
                value: 3,
                label: this.translate('USER.INFO.SITE_ID.CANDY_TALK')
            }],
            production_type: [{
                value: 0,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.APPLE')
            }, {
                value: 1,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.GOOGLE')
            }, {
                value: 2,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.CREDIT_CARD')
            }, {
                value: 3,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.BITCACH')
            }, {
                value: 4,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.CONVENIENCE')
            }, {
                value: 5,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.POINTS_BACK')
            }, {
                value: 6,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_METHOD.CCHECK')
            }],
            production_type_dialog: [{
                value: 0,
                label: this.translate('USER.TOTAL_PURCHASE.CONDITION.APPLE')
            }, {
                value: 1,
                label: this.translate('USER.TOTAL_PURCHASE.CONDITION.GOOGLE')
            }, {
                value: 2,
                label: this.translate('USER.TOTAL_PURCHASE.CONDITION.CREDIT')
            }, {
                value: 3,
                label: this.translate('USER.TOTAL_PURCHASE.CONDITION.BITCACH')
            }, {
                value: 4,
                label: this.translate('USER.TOTAL_PURCHASE.CONDITION.CONVENIENCE')
            }, {
                value: 5,
                label: this.translate('USER.TOTAL_PURCHASE.CONDITION.POINT_BACK')
            }, {
                value: 6,
                label: this.translate('USER.TOTAL_PURCHASE.CONDITION.POINT_CCHECK')
            }],
            add_by_admin: [{
                value: 0,
                label: this.translate('LOG.PURCHASE_LOG.ADD_NORMALY')
            }, {
                value: 1,
                label: this.translate('LOG.PURCHASE_LOG.ADD_MANUALLY')
            }],
            buzz_status: [{
                value: 2,
                label: this.translate('LOG.BUZZ.STATUS.ALL')
            }, {
                value: 1,
                label: this.translate('LOG.BUZZ.STATUS.APPROVE')
            }, {
                value: -1,
                label: this.translate('LOG.BUZZ.STATUS.DENY')
            }, {
                value: 0,
                label: this.translate('LOG.BUZZ.STATUS.PENDING')
            }],
            condition_end_call: [{
                value: 1,
                label: this.translate('LOG.VOICE_VIDEO_CALL.CONDITION.BUSY')
            }, {
                value: 2,
                label: this.translate('LOG.VOICE_VIDEO_CALL.CONDITION.CANCEL')
            }, {
                value: 3,
                label: this.translate('LOG.VOICE_VIDEO_CALL.CONDITION.END_CALL_BY_MALE')
            }, {
                value: 4,
                label: this.translate('LOG.VOICE_VIDEO_CALL.CONDITION.END_CALL_BY_FEMALE')
            }, {
                value: 5,
                label: this.translate('LOG.VOICE_VIDEO_CALL.CONDITION.END_CALL_BY_NOT_ENOUGH_POINT')
            }, {
                value: 6,
                label: this.translate('LOG.VOICE_VIDEO_CALL.CONDITION.OTHERS')
            }],
            purchaseSuccess: [{
                value: "",
                label: this.translate('FORM.PLEASE_SELECT')
            }, {
                value: 0,
                label: this.translate('FORM.NO')
            }, {
                value: 1,
                label: this.translate('FORM.YES')
            }],
            purchaseTypes: [{
                value: "",
                label: this.translate('FORM.PLEASE_SELECT')
            }, {
                value: 0,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_TYPE_SANDBOX')
            }, {
                value: 1,
                label: this.translate('LOG.PURCHASE_LOG.PURCHASE_TYPE_PRODUCTION')
            }],
            paymentMethod: [{
                value: "",
                label: this.translate('FORM.PLEASE_SELECT')
            }, {
                value: 0,
                label: this.translate('LOG.PURCHASE_LOG.ADD_NORMALY')
            }, {
                value: 1,
                label: this.translate('LOG.PURCHASE_LOG.ADD_MANUALLY')
            }],
            actionOnDetailUser: [{
                value: 0,
                label: this.translate('USER.USER_AUTO_NOTIFICATION.LB_CREATE_AUTO_NOTIFICATION')
            }, {
                value: 1,
                label: this.translate('USER.USER_NEW_LOGIN.LB_CREATE_NEW_LOGIN')
            }, {
                value: 2,
                label: this.translate('USER.USER_AUTO_MESSAGE.LB_CREATE_AUTO_MESSAGE')
            }/* , { //#11752
                value: 3,
                label: this.translate('FORM.BTN_ADD_POINT')
            } */, {
                value: 4,
                label: this.translate('USER.USER_CONTACT.LB_CREATE_CONTACT')
            }],
            gender_generality: [{
                value: 2,
                label: this.translate('USER.INFO.BOTH')
            }, {
                value: 0,
                label: this.translate('USER.INFO.MALE')
            }, {
                value: 1,
                label: this.translate('USER.INFO.FEMALE')
            }],
            approve_deny_image_filter: [{
                value: 0,
                label: this.translate('REPORT.APPROVE_DENY_IMAGE.PENDING')
            }, {
                value: 1,
                label: this.translate('REPORT.APPROVE_DENY_IMAGE.APPROVED')
            }, {
                value: -1,
                label: this.translate('REPORT.APPROVE_DENY_IMAGE.DENIED')
            }, {
                value: 2,
                label: this.translate('REPORT.APPROVE_DENY_IMAGE.SELECT_ALL')
            }],
            listApplicationID: [{
                value: 1,
                name: "meets1",
                label: this.translate('USER.USER_LIST.APPLICATION_ID.APP1')
            }, {
                value: 2,
                name: "meets2",
                label: this.translate('USER.USER_LIST.APPLICATION_ID.APP2')
            }, {
                value: 3,
                name: "meets3",
                label: this.translate('USER.USER_LIST.APPLICATION_ID.APP3')
            }],
            message_type: [{
                value: 0,
                label: this.translate('LOG.CHAT.FILTER_MESSAGE_TYPE.ALL')
            }, {
                value: 1,
                label: this.translate('LOG.CHAT.FILTER_MESSAGE_TYPE.PICTURE')
            }, {
                value: 2,
                label: this.translate('LOG.CHAT.FILTER_MESSAGE_TYPE.VIDEO')
            }],
            statusLogChatSendReceive: [{
                value: 0,
                label: this.translate('FORM.RECIPIENT')
            }, {
                value: 1,
                label: this.translate('LOG.CHAT.OWNER')
            }],
            autoApproveState: [{
                value: 0,
                label: this.translate('SETTINGS.GENERAL.OTHER_SETTING.PENDING')
            }, {
                value: 1,
                label: this.translate('SETTINGS.GENERAL.OTHER_SETTING.APPROVED')
            }],
            video_secret_filter_by_status: [{
                value: 0,
                label: this.translate('REPORT.VIDEO_MANAGEMENT.PENDING')
            }, {
                value: 1,
                label: this.translate('REPORT.VIDEO_MANAGEMENT.APPROVED')
            }, {
                value: -1,
                label: this.translate('REPORT.VIDEO_MANAGEMENT.DENIED')
            }, {
                value: 2,
                label: this.translate('REPORT.VIDEO_MANAGEMENT.SELECT_ALL')
            }],
            video_secret_filter_by_time: [{
                value: 1,
                label: this.translate('REPORT.VIDEO_MANAGEMENT.UPLOAD_TIME')
            }, {
                value: 2,
                label: this.translate('REPORT.VIDEO_MANAGEMENT.REVIEW_TIME')
            }],
            showPaymentPage: [{
                value: 1,
                label: this.translate('FORM.ON')
            }, {
                value: 0,
                label: this.translate('FORM.OFF')
            }],
            //#10990
            videoTypes: [{
                value: 1,
                label: this.translate('REPORT.REPORT_VIDEO.PUBLIC')
            }, /* {
                value: 2,
                label: this.translate('REPORT.REPORT_VIDEO.BACKSTAGE')
            } */],
            videoStatus: [{
                value: 0,
                label: this.translate('REPORT.INAPPROPRIATE_IMAGE.WAITING')
            }, {
                value: 1,
                label: this.translate('REPORT.INAPPROPRIATE_IMAGE.GOOD')
            }, {
                value: -1,
                label: this.translate('REPORT.INAPPROPRIATE_IMAGE.NOT_GOOD')
            }],
            sortBys: [{
                value: 1,
                label: this.translate('REPORT.INAPPROPRIATE_IMAGE.REPORT_TIME')
            }, {
                value: 2,
                label: this.translate('REPORT.INAPPROPRIATE_IMAGE.REPORT_NUMBER')
            }],
            //#11014: optimal code 
            state: [{
                value: false,
                label: this.translate('FORM.OFF')
            }, {
                value: true,
                label: this.translate('FORM.ON')
            }],
            orderedInput: {
                areasAddPoint: [{
                    name: 'daily_bonus',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.DAILY_POINT_BONUS'),
                    min: 0,
                    max: 1000000000
                },
                {
                    name: 'advertsement',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.ADVERTISEMENT'),
                    min: 0,
                    max: 1000000000
                },
                {
                    name: 'register',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.REGISTER'),
                    min: 0,
                    max: 1000000000
                }
                ],
                areasAddPointReceiveGift: [{
                    name: 'receive_gift',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.RECEIVE_GIFT'),
                    min: 0,
                    max: 100
                }],
                areasMinusPoint: [{
                    name: 'online_alert',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.ONLINE_ALERT'),
                    order: 3,
                    min: 0,
                    max: 1000000000
                }],
                areasAddMinusPoint: [{
                    name: 'chat',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.CHAT'),
                    order: 6,
                    min: -1000000000,
                    max: 1000000000
                },
                {
                    name: 'wink',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.WINK'),
                    min: 0,
                    max: 1000000000
                },
                {
                    name: 'save_image',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.SAVE_IMAGE'),
                    min: -1000000000,
                    max: 1000000000
                }, {
                    name: 'comment_buzz',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.COMMENT_BUZZ'),
                    min: -1000000000,
                    max: 1000000000
                }, {
                    name: 'unlock_backstage',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.UNLOCK_BACKSTAGE_BONUS'),
                    min: -1000000000,
                    max: 1000000000
                }, {
                    name: 'view_image',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.VIEW_IMAGE'),
                    min: -1000000000,
                    max: 1000000000
                }, {
                    name: 'watch_video',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.WATCH_VIDEO'),
                    min: -1000000000,
                    max: 1000000000
                }, {
                    name: 'listen_audio',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.LISTEN_AUDIO '),
                    min: -1000000000,
                    max: 1000000000
                }, {
                    name: 'reply_comment',
                    value: {},
                    label: this.translate('SETTINGS.GENERAL.POINT_SETTING.REPLY_COMMENT'),
                    min: -1000000000,
                    max: 1000000000
                }
                ],

            },
            defaultProperty: {
                ethn: [{
                    value: 0,
                    name: this.translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.ETHNICITY.OPT_ALL')
                }, {
                    value: 1,
                    name: this.translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.ETHNICITY.OPT_SAME')
                }],
                distance: [{
                    value: 0,
                    name: this.translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.DISTANCE.NEAR')
                }, {
                    value: 1,
                    name: this.translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.DISTANCE.CITY')
                }, {
                    value: 2,
                    name: this.translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.DISTANCE.STATE')
                }, {
                    value: 3,
                    name: this.translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.DISTANCE.COUNTRY')
                }, {
                    value: 4,
                    name: this.translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.DISTANCE.WORLD')
                }]
            },
            orderConversation: [{
                name: 'male_male',
                errorCode: 4
            }, {
                name: 'male_female',
                errorCode: 6
            }, {
                name: 'female_male',
                errorCode: 10
            }, {
                name: 'female_female',
                errorCode: 12
            }],
            orderConnectPoint: [{
                name: 'male_male',
                errorCode: 4
            }, {
                name: 'male_female',
                errorCode: 6
            }, {
                name: 'female_male',
                errorCode: 10
            }, {
                name: 'female_female',
                errorCode: 12
            }],
            defineTab: {
                conversation: {
                    video_call: 'video', //video_call : data from server return , video : id of tab in html
                    voice_call: 'voice'
                },
                connectPoint: {
                    chat: 'chat',
                    save_image: 'saveImage',
                    comment_buzz: 'commentBuzz',
                    unlock_backstage: 'unlockBackstage',
                    view_image: 'viewImage',
                    watch_video: 'watchVideo',
                    listen_audio: 'listenAudio',
                    reply_comment: 'replyComment',
                    watch_secret_video: 'watchSecretVideo'
                }
            },
            //#11751
            sortBy: [{
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_SORT.USER_NAME')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_SORT.BIRTHDAY')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_SORT.REGISTER_TIME')
            }],
            profileImage: [{
                value: '',
                label: this.translate('FORM.PLEASE_SELECT')
            },
            {
                value: 0,
                label: this.translate('FORM.NO')
            },
            {
                value: 1,
                label: this.translate('FORM.YES')
            }
            ],
            //#11854
            hobby: [{
                value: 1,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.XEM_PHIM')
            }, {
                value: 2,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.DOC_SACH')
            }, {
                value: 3,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.NGHE_THUAT')
            }, {
                value: 4,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.XEM_KICH')
            }, {
                value: 5,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.AM_NHAC')
            }, {
                value: 6,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.THOI_TRANG')
            }, {
                value: 7,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.TRUYEN_TRANH')
            }, {
                value: 8,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.THU_CUNG')
            }, {
                value: 9,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.NAU_AN')
            }, {
                value: 10,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.SANH_AN')
            }, {
                value: 11,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.RUOU')
            }, {
                value: 12,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.LAM_VUON')
            }, {
                value: 13,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.THE_THAO')
            }, {
                value: 14,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.SUC_KHOE')
            }, {
                value: 15,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.GOLF')
            }, {
                value: 16,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.TENNIS')
            }, {
                value: 17,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.TRUOT_TUYET')
            }, {
                value: 18,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.LUOT_VAN')
            }, {
                value: 19,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.LAN')
            }, {
                value: 20,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.CAU_CA')
            }, {
                value: 21,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.LEO_NUI')
            }, {
                value: 22,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.THE_THAO_KHAC')
            }, {
                value: 23,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.BIEN')
            }, {
                value: 24,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.DU_LICH')
            }, {
                value: 25,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.HD_NGOAI_TROI')
            }, {
                value: 26,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.HD_TRONG_NHA')
            }, {
                value: 27,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.BI_A')
            }, {
                value: 28,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.KARAOKE')
            }, {
                value: 29,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.CHUP_ANH')
            }, {
                value: 30,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.MANG_PC')
            }, {
                value: 31,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.PHIM_HAI')
            }, {
                value: 32,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.DIEN_TU')
            }, {
                value: 33,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.XE_MAY')
            }, {
                value: 34,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.XE_DAP')
            }, {
                value: 35,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.MAY_CHOI_BAC')
            }, {
                value: 36,
                label: this.translate('USER.PROPERTY.SELECT_HOBBY.DUA_NGUA')
            }]
        };
    };
    namespace.LabelManager.prototype = new Object;
    namespace.LabelManager.prototype.get = function (attributeName, injectSelectAll) {
        var attributeDefination = angular.copy(this.attributes[attributeName]);
        if (injectSelectAll) {
            if (isArray(attributeDefination)) {
                attributeDefination.splice(0, 0, {
                    value: '',
                    label: this.translate('FORM.PLEASE_SELECT')
                });
            }
        }

        return attributeDefination;
    };
})(window);