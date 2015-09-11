var WsConf = {
	//Url : 'http://10.0.0.2:9100/faxserver/JSActionServlet'
	Url : 'JSActionServlet'
}

//国际化
//0x6F000040:需要处理规则内容
var internationalCon = {
	0x6F000001:'获取子目录失败',
	0x6F000002:'生成缩略图失败',
	0x6F000003:'生成原始图失败',
	0x6F000004:'保存草稿错误',
	0x6F000005:'翻转图片失败',
	0x6F000006:'合并tif文件失败',
	0x6F000007:'请重新上传文件',
	0x6F000008:'无法获取传真文件',
	535:'该smtp服务要求身份验证，请确认用户名和密码',
	77777:'输入旧密码错误',
	0x6F000009:'未找到匹配项',
	0x6F000010:'其他未知错误',
	0x6F000011:'无法取得电子图章',
	0x6F000012:'生成传真单页图失败',
	0x6F000013:'状态错误',
	0x6F000014:'翻转原始图片失败',
	0x6F000015:'生成单页图失败',
	0x6F000016:'生成传真页失败',
	0x6F000017:'在原始图上盖章失败',
	0x6F000018:'验证密码出错',
	0x6F000019:'WaveFax打印机错误',
	0x6F000020:'清除转换任务失败',
	0x6F000021:'直接转换文档失败',
	0x6F000022:'文件不存在',
	0x6F000023:'文件大小错误',
	0x6F000024:'文档转换失败',
	0x6F000025:'直接转换文档失败',
	0x6F000026:'打开WaveFax打印机失败',
	0x6F000027:'设置缺省WaveFax打印机失败',
	0x6F000028:'打印文档失败',
	0x6F000029:'转换超时',
	0x6F000030:'文件不支持转换为传真格式',
	0x6F000031:'在原始图上添加文字批注失败',
	0x6F000032:'在原始图上画线失败',
	0x6F000033:'转换原文件不存在',
	0x6F000034:'生成图章单页图失败',
	0x6F000035:'本地打印机转换失败',
	0x6F000036:'连接本地打印机服务失败',
	0x6F000037:'文件不存在',
	0x6F000038:'此模板不存在',
	0x6F000039:'导入文件的属性或数据域定义有误，请修正',	
	//	0x6F000040:需要处理规则内容,
	//0x6F000041:工作流任务被锁定,	
	0x6F000042:'上传文件失败',
	0x6F000043:'此目录已经收藏',
	// 0x6F000044 : 工作流审批职责已委托给他人
	0x6F000125:'本地打印取消操作',
	0xF000F11:'表单数据模版加载失败'
}

//ViewPort mainform
var viewPortEast;
//目录权限
var folderPrivAll = {
	folderPrivAdd : 1,
	folderPrivAddThread : 1,
	folderPrivAdmin : 1,
	folderPrivBackup : 1,
	folderPrivComment : 1,
	folderPrivDelete : 1,
	folderPrivDeleteThread : 1,
	folderPrivExport : 1,
	folderPrivList : 1,
	folderPrivModify : 1,
	folderPrivMove : 1,
	folderPrivPrint : 1,
	folderPrivView : 1,
	folderPrivViewThread : 1,
	folderPrivforword : 1
};

//目录权限 初始化为全部没有
var folderPrivNo = {
	folderPrivAdd : 0,
	folderPrivAddThread : 0,
	folderPrivAdmin : 0,
	folderPrivBackup : 0,
	folderPrivComment : 0,
	folderPrivDelete : 0,
	folderPrivDeleteThread : 0,
	folderPrivExport : 0,
	folderPrivList : 0,
	folderPrivModify : 0,
	folderPrivMove : 0,
	folderPrivPrint : 0,
	folderPrivView : 0,
	folderPrivViewThread : 0,
	folderPrivforword : 0
};

// 用户目录角色权限
function DirRole() {
	this.folderPrivList = 1;
	this.folderPrivView = 1;
	this.folderPrivModify = 1;
	this.inintDR = function() {
		var prms = arguments;
		this.folderPrivList = prms[1];
		this.folderPrivView = prms[2];
		this.folderPrivModify = prms[3];
	}
}

//是否支持Flash
var isSurportFlash = false;

// 登录窗口
var win;
// 发件箱 Grid
var myfaxgrid;
var grscGrid;
var wfdfgrid;
var trwrGrid;
//var defaultGird;
var tb;
var outfax;
var succoutfax;
var addressGird;
var draftGrid;
var docGrid;
var taskGrid;
var wfruleGrid;

//附件列表Grid
var slaveFGrid = '';

// 详细信息Form
// loadDetailFormForDefaultPng默认图片
var detailFormForDefaultPng = '';
var detailFormForDefaultPng1 = '';
// loadDetailFormForAddressgrid详细信息
var detailFormForAddressgrid = '';
// infaxgrid详细信息
var detailFormForInfaxgrid = "";
// succoutfaxgrid详细信息
var detailFormForSuccoutfaxgrid = "";
// outfaxgrid详细信息
var detailFormForOutfaxgrid = "";
//draft grid 详细信息
var detailFormForDraftgrid = '';
//doc grid 详细信息
var detailFormForDocgrid = '';
//taskgrid
var detailFormForTaskgrid = '';
var detailFormForRulegrid = '';

// 发送传真窗口
var sendfaxwin = '';
// 发送选项窗口
var sendfaxconfigwin = '';
// 通讯录用窗口
var addresspersonwin = '';
//追加收件人用窗口
var linkmenwin = '';
var superadditionwin = '';
//文档添加用窗口
var docaddwin = '';
//归档用窗口
var faxtodocwin = '';
//归档编辑窗口
var faxtodoceditor = '';
//工作流处理面板
var wfhandlerwin = '';

// 通讯录窗口用树
var addresspersonwinTree1 = '';
//追加收件人窗口用树
var superadditionwinTree = '';
//归档用树
var faxtodocwinTree1 = '';
var FolderTree1;
var addressTree1;
var docTree;
var wfTree;
var ForWardDirectoryTree;
//注释用窗口
var modifycommentwin='';
//内部转发用窗口
var faxforwardwin='';
//自定义时间过滤窗口
var infaxDateWin='';
//已发件箱自定义时间过滤窗口
var sucDateWin='';
//文档管理自定义时间过滤窗口
var docDateWin='';
//转发到邮件窗口
var inforEmailWin = '';
//文档用附件窗口
var docattwin = '';

// 图片编辑器
var winImageEditor = '';
//字体编辑器
var fontEditor = '';
//htmlEditor
var htmlEditor = '';
// 图章类变量
var stampcls = '';
// 加盖的图章临时变量
var stampTemp = '';
// 图章管理用窗口
var coverimgaegridwin = '';
// 历史消息窗口
var msghistorywin = '';

// 底部工具条用win
// serverinfo
var bsbwServerInfowin = '';
// PersonRolewin
var bsbwPersonRolewin = '';
// ViewPort
var ViewPortGridConfig = {
	oldHeight : '',
	oldWidh : ''
}
// 传真号码匹配的正则表达式
//var regexFaxNumber = /^((\d+-(\d|\#|\*)*)|(\(\d+\)(\d|\#|\*)*)|(\+(\d+) (\d|\#|\*)*)|(\+\d+\(\d+\)(\d|\#|\*)*))|((0+[1-9]\d{2,}))$/;
var regexFaxNumber1 = /(^sip\:[0-9a-zA-Z#-_]+@[0-9a-zA-Z.-_]+$)|(^\d+-(\d|\#|\*)*$)|(^\(\d+\)(\d|\#|\*)*$)|(^\+[\d][123457890](\d*) (\d|\#|\*)+$)|(^\+[123456790][\d](\d*) (\d|\#|\*)+$)|(^\+[1] (\d|\#|\*)+$)|(^\+[7] (\d|\#|\*)+$)|(^\+[\d][6](\d+) (\d|\#|\*)+$)|(^\+(\d+)\(\d+\)(\d|\#|\*)+$)|(^(0+[1-9]\d{2,})$)|(^\d+$)/;
//var regexFaxNumber1 = /^\+(\d+)\(\d+\)(\d|\#|\*)*$/;
//文件夹名称验证
var regexFolderName = /^[^\\/?: *"<>|]+$/;
//邮箱验证正则表达式
var regexEmail = /^(\w|\.)+\@\w+\.\w+$/;
// 系统配置用窗口
var systemconfigwin_sys = '';
var systemconfigwin_person = '';
var systemconfigwin_sub = '';	// 职责委任
var systemconfigwin_rule = '';	//规则

// 数字验证用正则表达式
var regexNumber = /^\d*$/;

// 默认的配置
var userConfig = {
	gridPageSize : 10,
	countryCode : '86',
	areaCode : '20',
	autoReadSec : 5,
	outfaxreSec:5,//发件箱默认刷新间隔
	listAll : true,// 目录列出不可查看记录内容的文件夹
	addSource : true,// 回复传真时添加原文档
	viewDocPic : true,// 表单数据输入界面显示文档图
	validateFront : true,// 提交工作流任务前先确认
	myUserName : '',// 用户信息 姓名
	myEmail : '',// 用户信息 邮件地址
	sendService : '',// 发送邮件服务器
	mailUserName : '',// 邮件服务器登陆用户名
	mailPassWord : '',// 邮件服务器登陆密码
	msgtaskallow : true,// 是否开启计算机通报
	msgtaskinterval : 20, // 计算机通报间隔时间 秒
	msgboxkeeptime : 0,// 消息窗口保持时间,0为不自动关闭 秒
	//	scDetailSend:false,//发送选项—提交到服务器暂不发送
	scProLever:'2',//发送选项—优先级
	scFailCount:3,//发送选项—失败重试次数
	scStepMin:60,//发送选项—重试间隔 秒
	scMesReciver:false,//发送选项—短信通知收件人
	scMailReciver:false,//发送选项—邮件通知收件人
	scPageHeader:true,//发送选项—添加页眉
	scTryFist:true,//发送选项—失败重试从第一页开始
	scResolution:true,//发送选项—使用200x200分辨率发送传真
	scUsedGroupPort:false,//发送选项—使用群发端口

	secType:'1',	//邮件服务 安全连接类型
	connPort:25, //邮件服务 连接端口
	inruleConfig: [],	//规则设置,
	printerSrc:'0',
	prType:'0', // 打印机类型 doc/photo
	miniPngSize:'1'//缩略图尺寸控制 0小 1大
	//docprinterSrc:'0',
	//docprType:'0' // 打印机类型 doc/photo
}
// UserInfoData 登录用户登录信息
var userInfoData;
// 服务器信息
var serverInfoModel;
var roleInfoModel;

var docResourceType = {
	INFAX:'传真收件箱',
	OUTFAX:'传真(已)发件箱',
	INVOICE:'',
	OUTVOICE:'',
	INSMS:'短信发件箱',
	OUTSMS:'短信(已)发件箱',
	PHONEBOOK:'',
	DOCUMENT:'文档管理'
}
var languageArr = new Array('简体中文','English');
var printerSrcArr = new Array('服务端文档转换', '本地文档转换');
var printerType = new Array('传真速度优先','图像质量优先');
var faxResolutionArr = new Array('低分辨率', '高分辨率');
var faxFlagArr = new Array('无标签', '紧急的', '重要的', '工作', '私人', '将要处理', '正在处理',
	'已经处理', '需要备份', '需要审核', '广告', '垃圾');
var taskFlagArr = new Array('普通','重要','紧急');
var statusArr = new Array('等待传真转换', '等待传真审批', '正在进行传真转换 ', '等待发送传真 ', '暂停发送',
	'已经被发送设备获取', '正在进行拨号', '正在进行传真发送', '发送完毕 失败', '发送完毕 成功');
var priorityArr = new Array('最高', '较高', '普通', '较低', '低');
var genderArr = new Array('男', '女');
var outFaxErrCodeArr = new Array('无错误', '传真文档转换失败(包括模版数据错误)', '未通过传真审批',
	'拨号失败或无效号码', '线路忙', '对方挂机', '拨号超时', '不支持的Modem', '传真协议过程失败', '线路噪音大',
	'通讯端口错误', '发送被用户提前终止', '达到了用户帐号传真发送配额限制,所以无法发送传真', '未知错误，传真过程失败');
var emailAccType = new Array('Ms Exchange', 'POP3', 'IMAP', 'HTTP');
var supportType = new Array('bmp','png','htm','tif','tiff','gif','txt','doc','docx','pdf','pdb','ppt','pptx','pub','xls','xlsx','html','csv','csvx','rtf','log','jpg','jpeg');

var fontFamilies = new Array('Arial','Tahoma','MS Sans Serif','Times New Roman','宋体','黑体','楷体_GB2312');
if (navigator.platform == "Win32" || navigator.platform == "Windows") {
	var sUserAgent = navigator.userAgent;
	if (sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1) {
		fontFamilies.push('微软雅黑');
	}
}

var fontSizes = new Array('10','12','14','16','18','20','22','24','26','28','30','44','56','64','68','72');

var sessionToken = Ext.util.Cookies.get("sessiontoken");
var userInfo = Ext.util.Cookies.get("ws_userInfo");
var password = Ext.util.Cookies.get("ws_password");
var checksavepass = Ext.util.Cookies.get("ws_checksavepass");

var WaveFaxConst = {
	RootFolderID : 0,
	RecycleFolderID : 0x3FFFFFFE,
	PublicRootFolderID : 0x7FFFFFF0,
	PublicRecycleFolderID : 0x7FFFFFFE,
	DontCareFolderID : 0x3FFFFFFF, // 任何目录,在某些函数的调用中,此参数表示忽略目录ID
	// 操作返回错误码
	ResOK : 0x00000000, // 操作成功完成
	ResFullPrint: 0x00000018, // 没有空闲的传真文档转换队列
	ResPartialOK : 0x0F000001, // 操作部分成功完成,用于需要查询记录状态以确定操作结果
	ResSessionTokenError : 0x0F000002, // 无效登录事务标识
	ResSessionTimeOut : 0x0F000004, // 此登录事务已超时,请重新登录
	ResOperationDeny : 0x0F000008, // 事务标识所属用户无权限
	ResDBError : 0x0F000009, // 服务器数据库异常
	ResInternalError : 0x0F000010, // 服务器内部异常
	ResParamError : 0x0F000011, // 参数错误
	ResSystemError : 0x0F000014, // 服务器操作系统异常
	ResInputParamsError : 0x0F000018, // 传入参数错误
	ResConnectServerFailed : 0x0F000019, // 连接服务器失败
	ResOperationNoSense : 0x0F000020, // 操作无意义
	ResHasNotImplement : 0x0F000021,	// 操作还未实现
	ConServerError: 0x6FFFFFFB,			//主控服务异常，连接失败
	
	CasLogoutCode: 0x6FFFFFFE,	//cas登出标识代码

	//登录失败错误码
	ResNoUserName : 0x0F000110,	//无效用户名
	ResPasswordError : 0x0F000111,	//密码错误
	ResUserInvalid : 0x0F000113,	//用户被冻结或无效
	ResDomainLoginFailed : 0x0F000114,	//映射域登陆验证失败

	ResInvalidFolderID : 0x0F000030,// 	无效目录ID
	ResFolderTypeNotMatch : 0x0F000032,// 	目录类型不匹配
	ResDupFolderName : 0x0F000033,// 	目录名称重复
	ResFolderNotEmpty : 0x0F000034,// 	目录非空
	ResTooManyFolders : 0x0F000038,// 	目录数量超过限制

	ResInvalidDocID:0x0F000E31,//无效的归档ID
	ResInvalidDocInfo:0x0F000E32//无效的归档信息	
	
}
// 通报设置常量
var NotificationConst = {
	NotifyNone : 0x00000000, // 无通报
	NotifyMeOnReceive : 0x00000001, // 接收传真/语音通报
	NotifyMeOnSentOK : 0x00000002, // 发送成功通报
	NotifyMeOnSentErr : 0x00000004,// 发送错误通报
	NotifyEmailAttachmentOnReceive : 0x00000010,// 接收邮件通报包含内容附件(只针对邮件通报)
	NotifyEmailAttachmentOnSendOK : 0x00000020,// 发送成功邮件通报包含内容附件(只针对邮件通报)
	NotifyEmailAttachmentOnSendErr : 0x00000040,// 发送失败邮件通报包含内容附件(只针对邮件通报)
	NotifyMeOnWorkflowOK : 0x00000080,// 工作流成功通报
	NotifyMeOnWorkflowFailed : 0x00000100,// 工作流失败通报
	NotifyMeOnWaitWorkflow : 0x00000200,// 等待工作流任务通报
	NotifyTaskSubstitution : 0x00000400
	// 职责委任通报(收到他人的职责委任，职责委任到期)
}
// 传真页眉默认值
var FaxPageHeaderDefaults = {
	left : 'From:[SenderOrganization] To:[RecipientName]',
	middle : 'Date:[SendDate] Time:[SendTime]',
	right : 'Page [PageIndex] of [Pages]'
}

// 自动已读设置用
var setReadFlagTask = new Ext.util.DelayedTask();
// addressTree
var addressTreeLoading = 0;
//superadditionTree
var superadditionTreeLoading = 0;
var docTreeLoading = 0;
var orgniTreeLoading = 0;	//组织目录loading
var orgniTreeWin = '';	//组织目录树窗口

// accordion切换task
var accordionTask = new Ext.util.DelayedTask();
// 传真页眉当前焦点变量
var faxPHFocusVar = '';
// 文件上传加载Loding
//var callMask;
// 计算机通报窗口定时器
var taskMessageBoxRunner = new Ext.util.TaskRunner();
// 发件箱自动刷新定时器
var taskOfReRunner = new Ext.util.TaskRunner();
//发件箱自动刷新延迟器
var delayOf = new Ext.util.DelayedTask();
//发件箱自动刷新标识
var isOfRshing = false;

// 图章密码验证类型
var EnumEStampAuthType = {
	satpNone : 0,// 验证,直接使用 (用户必须已经登录到WaveFax服务器)
	satpPassword : 1,// 使用图章本身密码
	satpAccountAuth : 2,// 使用当前登录用户认证 (用户必须再次输入登录密码)
	satpCertAuth : 3,// 使用数字证书认证 (具有高安全度)
	satpLocalAuth : 4
	// 使用本地验证
}

//草稿箱用按文件id装 map
var draftMaps =  new Ext.util.MixedCollection();
//调色板
var colorPicker = '';
var bgcolorPicker = '';
//登录Loading
//var loginLoading;
//密码窗口
var promWin;

//表头
var gridTitle;
//工具栏
var	northTb;
var southTb;
//详细信息及图像浏览
var	viewFaxFileTab;
////传真图 详细信息切换按钮
var centerSVBtn;
//登录进度条函数
var ireLoading;
//画笔类
var penClass;
////控制面板窗口加载
var loadSysConfig;
//传真编辑窗口加载
var loadFaxEditor;

//画笔延迟器
var drawlinedelay = new Ext.util.DelayedTask();
//画笔临时层
var tempdd='';
//画笔编辑器
var lineEditor='';
//画笔颜色选择器
var lineColorPicker = '';
//当前的Grid
var currGrid;
//树选择delay
var treeSelDelay = new Ext.util.DelayedTask();
//是否禁用serverInfo
var serverInfoDis = false;
//对话框
var newMesB = Ext.create('Ext.window.MessageBox', {});
var expMesB = Ext.create('Ext.window.MessageBox', {});


//grid插件数组变量
var gridPlugin = {
	infaxPlugin:new Ext.util.MixedCollection(),
	outfaxPlugin : new Ext.util.MixedCollection(),
	succoutfaxPlugin : new Ext.util.MixedCollection(),
	draftPlugin :new Ext.util.MixedCollection(),
	addressPlugin: new Ext.util.MixedCollection(),
	docgridPlugin: new Ext.util.MixedCollection()
}
//系统状态保存
var wsUserStates;
//区域号码数组
var areaNumberArr = ['995','994','993','992','977','976','974','973','972','971','968','967','966','965','964','963','962','961','960',
'886','880','856','855','853','852','850',
'689','685','684','682','679','677','676','675','673',
'599','598','597','596','595','594','593','592','591','509','507','506','505','504','503','502','501',
'423','421','420',
'386','381','380','378','377','376','375','374','373','372','371','370','359','358','357','356','355','354','353','352','351','350','331','327',
'268','267','266','265','264','263','262','261','260','258','257','256','255','254','253','252','251','249','248','247','244','243','242','241','239','237','236',
'235','234','233','233','232','231','230','229','228','227','226','225','224','223','221','220','218','216','213','212',
'98','95','94','93','92','91','90',
'86','84','82','81',
'66','65','64','63','62','61','60',
'58','57','56','55','54','53','52','51',
'49','48','47','46','45','44','43','41','40',
'39','36','34','33','32','31','30',
'27','20',
'7','1'
];
function getArNum(num) {
	var flag = '无效';
	Ext.Array.each(areaNumberArr, function(anum,index,alls) {
		if(num == anum) {
			flag = num;
		}
	});
	return flag;
}

//树首选项
// var tempItem;
// var addtmpItem;
// var doctmpItem;
//录入窗口
var	inputDataWin = '';
var	searchDataWin = '';
//发送传真用录入数据窗口
var sendfax_inputDataWin = '';
//添加文档用录入数据窗口
var doc_inputDataWin = '';
//工作流审核用录入数据窗口
var wf_inputDataWin = '';
//工作流用注释窗口
var wfcomentwin = '';
//文档打开窗口
var docopenwin = '';
//归档单个窗口
var faxtodocsinglewin = '';
//模版用数据
var template;
//规则设置
var ruleSettingFlag = false;
//模版查询Filter前缀变量
var tplPrefix = '|FD+PREX|.';
//文字批注上次用的状态
var preSTemp = '';
//状态保存临时变量
var myStates;
////全屏查看pal高度
//var cplHeight = 0;
//var cpltmH = 0;

//任务id切换延迟器
var tgridIdClickdelay = new Ext.util.DelayedTask();
//全屏查看用窗口
var seefillfaxwin = '';


