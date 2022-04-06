package com.wicore.wiapp.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.wicore.wiapp.beans.Customer;
import com.wicore.wiapp.beans.MobileBean;
import com.wicore.wiapp.beans.RequestBean;
import com.wicore.wiapp.prebill.BillUtility;
import com.wicore.wiapp.useridentification.MSISDNReader;
import com.wicore.wiapp.billingpartners.BillingPartner;
import com.wicore.wiapp.billingpartners.BillingPartnerFactory;
import com.wicore.wiapp.dao.ActionDAO;
import com.wicore.wiapp.dao.CustomerDAO;
import com.wicore.wiapp.dao.TokenInfoDAO;
import com.wicore.wiapp.utility.ConnectionDAO;
import com.wicore.wiapp.utility.ContentUtility;
import com.wicore.wiapp.utility.CookieUtility;
import com.wicore.wiapp.utility.FilterUtility;
import com.wicore.wiapp.utility.TransId;
import com.wicore.wiapp.utility.Utility;

public class Index extends HttpServlet {
	org.apache.log4j.Logger log=null;
	private static String TAG = "Index";
	public Index() {
    
	}
	public void init(){
		log=org.apache.log4j.Logger.getLogger("WiApp:Index");
		log.setLevel(org.apache.log4j.Level.INFO);
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);		
	}

	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);		
	}
	
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
    	process(request, response);
    }
    
    protected void process(HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("text/html; charset=UTF-8");
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
		String filterQS = "";
		
		java.io.InputStream is = null;
    	String isStr = "";
    	
		try {
			
			
			RequestBean requestBean = Utility.getRequestBean(request,response);
			MobileBean mb = MSISDNReader.getMSISDN(request, response, -1 /*Group ID*/ );
			log.info("MobileBean : "+mb.toString());
			
			String service_id=request.getParameter("service_id")!=null?request.getParameter("service_id"):"";
    		String pg_id=request.getParameter("pg_id")!=null?request.getParameter("pg_id"):"";
    		String recos = request.getParameter("recos")!=null?request.getParameter("recos"):"";
    		String cpage = request.getParameter("cpage")!=null?request.getParameter("cpage"):"N";
    		String json = request.getParameter("json")!=null?request.getParameter("json"):"N";
    		
    		String qs = request.getParameter("qs")!=null?request.getParameter("qs"):"";
    		String page = request.getParameter("page")!=null?request.getParameter("page"):"";
    		String customer_id = request.getParameter("cust_id")!=null?request.getParameter("cust_id"):"";
    		
    		String gIdToken = "";
    		int op_id = 0, cust_id=0;
    		
    		Customer customerBean = CustomerDAO.getCustomer(request,service_id,pg_id,recos,cpage);
        	
        	if(service_id.equals("")){
        		service_id=customerBean.getServiceId();
        	}
        	if(customer_id.equals("")){
        		cust_id=customerBean.getCust_id();
        	}
        	log.info("cust_id::::"+cust_id);
        	if(mb != null) {
        		op_id = mb.getOp_id();
        		
        	}
        	String log_info = "Cust_Name : "+customerBean.getCust_name();
        	
        	is = request.getInputStream();
    		isStr = IOUtils.toString(is).trim();
    		String userID = "", cookieID = "";
    		boolean isCookieCreated = false;
    		//log.info("InputStream : "+isStr);
    		boolean iscreateCookie = false;
    		Connection con = ConnectionDAO.getConnection();
		//	cookieID = CookieUtility.getCookieidFromBrowser(request,log_info);
    		
    			
    		if (mb != null && mb.getMobile_no() !=null && !mb.getMobile_no().equals("")) {
    			if (mb != null) {
        			customerBean.setMobileBean(mb);
        		}
        			
        			
    			
    			if((cookieID.equals("NA") || cookieID.equals(""))) {
    				userID = CookieUtility.getUserID(con, customerBean.getMobileBean().getMobile_no());
    				 log.info("old user_id ::" +userID+" | msisdn:: " +customerBean.getMobileBean().getMobile_no());
    				cookieID = CookieUtility.getCookieExistsWithUserID(con, userID, log_info);
    				if (!cookieID.equals("")) {
    					CookieUtility.createBrowserCookieWithExistingCookie(response, cookieID, log_info);
    					isCookieCreated = true;
    					
    					log.info("old cookie_id ::" +cookieID+" | isCookieCreated: " +isCookieCreated);
    				} else {
    					
    					cookieID = CookieUtility.createBroswerCookie(request, response, log_info, iscreateCookie);
    					isCookieCreated = true;
    					log.info("new cookie_id ::" +cookieID+" | isCookieCreated: " +isCookieCreated);
    					//cookieID = CookieUtility.createBroswerCookie(request, response, log_info);
    					//log.info("reading cookie_id again::" +cookieID);
    				}
    			}
    			
    		//	String cookieID = CookieUtility.createBroswerCookie(request, response, "");
    			
    			if(userID.equals("")) {
    				 userID = CookieUtility.getUserIdFromCookieId(cookieID, "");
    				 log.info("new user_id ::" +userID);
    			}
				log.info("userId::" +userID+" | cookieID::" +cookieID+" | ");
				customerBean.setCookieID(cookieID);
				customerBean.setCookieUserID(userID);
				CookieUtility.storeCookieINFO(customerBean, cookieID, log_info);
				//TokenInfoDAO.msisdnUserInfo(userID, customerBean.getMobileBean().getMobile_no()) ;
				TokenInfoDAO.msisdnUserInfo(userID, customerBean.getMobileBean().getMobile_no(), cust_id, service_id, op_id );
    		} 
    		
    		if (isStr != null && !isStr.equals("")) {
				JSONObject tokenJSON = new JSONObject(isStr);
				log.info("JSON Object:::" +tokenJSON);
	        	gIdToken = tokenJSON.has("idToken")?tokenJSON.getString("idToken"):"";
			
	        	if (!gIdToken.equals("")) {
	        		String resp = com.wicore.wiapp.utility.Utility.validateFirebaseToken(gIdToken.toString());
	        		
	    			if(resp!=null && !resp.equals(""))
	        		{
	    				
	        			JSONObject usersJSONOBJ = new JSONObject(resp);
	        			JSONArray userJSONArr = usersJSONOBJ.getJSONArray("users");
	        			JSONObject userJSONOBJ = userJSONArr.getJSONObject(0);
	        			
	        			log.info("Index Google User jsonObj : "+usersJSONOBJ+" | google user doesnt exist");
	    				String email = userJSONOBJ.getString("email");
	    				String name = userJSONOBJ.getString("displayName");
	    				String picture = userJSONOBJ.getString("photoUrl");
	    				customerBean.setCookieID("");
	    				customerBean.setGoogleCookieID("");
	                	customerBean.setGoogleUserID(email);
	    			}
	        		
	        	}
	        } else {
	        	
	        	log.info("Google login user exists.......................");
	        	if(!isCookieCreated) {
	        		cookieID = CookieUtility.createBroswerCookie(request, response, log_info, iscreateCookie);
	        		log.info("Google login new cookie_id ::" +cookieID+" | isExists: " +isCookieCreated);
	        	}
	        	if(userID.equals("")) {
	        		 userID = CookieUtility.getUserIdFromCookieId(cookieID, "");
	        		log.info("Google login new user_id ::" +userID);
	        	}
				customerBean.setCookieID(cookieID);
				customerBean.setCookieUserID(userID);
				
				CookieUtility.storeCookieINFO(customerBean, cookieID, log_info);
	        	
	        	String googleCookieID = CookieUtility.getGLoginCookieidFromBrowser(request, log_info);
	        	String googleUserID = CookieUtility.getGLoginUserIDFromCookieId(googleCookieID, log_info);
	        	
	        	//googleUserID = CookieUtility.getGLoginUserIDFromCookieId(cookieID, log_info);
	        	
	        	customerBean.setGoogleCookieID(googleCookieID);
	        	customerBean.setGoogleUserID(googleUserID);
	        	log.info("setGoogleUserID:: "  +googleUserID);
	    	}
    		
    		
    		//CookieUtility.deleteCookie(request, response, log_info, "pageVisisted");
        	
    		/* Checks whether the user is active or not for content */
	        boolean isActive = BillUtility.isActive(customerBean.getGoogleCookieID(), customerBean.getGoogleUserID());
	        customerBean.getCustomerServiceBean().setUserActive(isActive);
	        
	        if (!isActive) {
	        	boolean isUserInPending = BillUtility.isUserInPendingState(customerBean.getGoogleCookieID(), customerBean.getGoogleUserID());
	        	customerBean.getCustomerServiceBean().setUserInPending(isUserInPending);
	       }
	      
	        
	        
	        /* Get the Filters from the Services like News, Games etc */
        	//log.info("QS::"+requestBean.getQS()+"| FilterQS:: "+requestBean.getFilterQS());
        	
        	Set<Integer> serviceIDSet = new HashSet<Integer>();
        	serviceIDSet=Utility.getCustomerServiceIds(customerBean);
        	
        	PrintWriter pw = response.getWriter();
        	//log.info("serviceIDSet::"+serviceIDSet);
        	if(!serviceIDSet.isEmpty() && serviceIDSet.contains(Integer.parseInt(service_id)) )
        	{
        		//log.info("serviceId  :: "+service_id);
	        	if (!requestBean.getQS().equals("") && requestBean.getQS().contains("&")) 
	        	{
	        		filterQS = requestBean.getFilterQS();
	        	} else {
	        		filterQS = FilterUtility.getContentJSONFilters(customerBean,service_id);
	        	}
	        	/* Contructs content */
	        	
	        	if(!qs.equals("")) {
	        		filterQS = "qs="+qs+"&service_id="+service_id+"&cust_id="+cust_id+"&page="+page+"&offset=1&length=30";
	        	}
	        	
	        	//log.info(" filterQS : "+filterQS);
	        				ActionDAO.storeUserAction(customerBean.getCust_id()+"",service_id,"0","H",customerBean.getCookieID(), customerBean.getCookieUserID(), customerBean.getGoogleCookieID(), customerBean.getGoogleUserID(), "Visited");
	        	
	        	if(!filterQS.equals("")) {
	        		JSONArray contentArr = ContentUtility.getContentJSON(customerBean, requestBean, filterQS,service_id);
	            	/* Pass the contructed contentArr to WiFrame to render HTML */
	        		////log.info("contentArr::"+contentArr);
	        		if("N".equalsIgnoreCase(json))
	        		{
	        			String htmlStr = com.wicore.wiframeTest.RenderHTML.renderHTML(contentArr, request);
	        			htmlStr = "<!DOCTYPE html>"+htmlStr;
	        			//	htmlStr = "<!DOCTYPE html>"+htmlStr.replaceAll("http", "https").replaceAll("httpss", "https").replaceAll("202.65.157.186", "dev.wicore.in");
	        			pw.println(htmlStr);
	        		}
	        		else
	        		{
	        			pw.print(contentArr);
	        		}
	            } else {
	            	pw.println("<center><p>Oops something went wrong.</p></center>");
	            }
        	} else {
            	pw.println("<center><p>Oops something went wrong.</p></center>");
        	}
        
		} catch (Exception e) {
    		log.error("Exception in Index servlet : "+e);
    		e.printStackTrace();
    	}
   }
}
