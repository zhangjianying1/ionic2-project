//
//  HttpPlugin.m
//  HttpPlugin
//
//  Created by cndym on 2016/10/27.
//  Copyright © 2016年 com.cncom.cndym. All rights reserved.
//

#import "Http.h"

#import <ifaddrs.h>
#import <arpa/inet.h>


@interface Http()
-(NSString *) md5:(NSString *) inStr;
-(NSString *) buildMsgMd5Str:(NSDictionary *) dis;
-(NSString *) buildMd5Str:(NSString *) cmd machId:(NSString *) machId msg:(NSString *) msg;
-(NSString *) buildHttpParam:(NSDictionary *) dis;
-(NSString *) getIp;
@end


@implementation Http

NSString * const sid = @"90000";
NSString * const sidKey = @"rj2iiKlMSccM5j5iccifjcGcSSK52GK5";
NSString * const platform = @"02";

- (void)httpPost:(CDVInvokedUrlCommand*)command
{

    NSString* urlStr = [command.arguments objectAtIndex:0];
    NSDictionary* param = [command.arguments objectAtIndex:1];
    if (urlStr != nil && param !=nil) {
        NSString *paramStr = [self buildHttpParam:param];
        NSMutableString *paramStrBuff = [[NSMutableString alloc] initWithString:@"msg="];
        [paramStrBuff appendString:paramStr];
        NSData *paramData = [paramStrBuff dataUsingEncoding:NSUTF8StringEncoding];




        NSURL *url = [NSURL URLWithString:urlStr];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
        request.HTTPMethod = @"POST";
        request.HTTPBody = paramData;
        NSURLSession *session = [NSURLSession sharedSession];
        NSURLSessionTask *task =
        [session dataTaskWithRequest:request
                   completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                       CDVPluginResult* pluginResult = nil;
                       _reBody = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
                       pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:_reBody];
                       [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                   }];
        [task resume];

    } else {
        CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Arg was null"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }

}


- (void)httpsPost:(CDVInvokedUrlCommand*)command
{

    NSString* urlStr = [command.arguments objectAtIndex:0];
    NSDictionary* param = [command.arguments objectAtIndex:1];
    if (urlStr != nil && param !=nil) {
        NSString *paramStr = [self buildHttpParam:param];
        NSMutableString *paramStrBuff = [[NSMutableString alloc] initWithString:@"msg="];
        [paramStrBuff appendString:paramStr];
        NSData *paramData = [paramStrBuff dataUsingEncoding:NSUTF8StringEncoding];

        //dispatch_semaphore_t disp = dispatch_semaphore_create(0);
        NSURL *url = [NSURL URLWithString:urlStr];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
        request.HTTPMethod = @"POST";
        request.HTTPBody = paramData;
        NSURLSession *session = [NSURLSession sharedSession];
        NSURLSessionTask *task =
        [session dataTaskWithRequest:request
                   completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                       _reBody = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
                       CDVPluginResult* pluginResult = nil;
                       pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:_reBody];
                       [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                   }];
        [task resume];
        // dispatch_semaphore_wait(disp, DISPATCH_TIME_FOREVER);

    } else {
        CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Arg was null"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }

}

- (NSString *) md5:(NSString *) inStr {
    const char *cStr = [inStr UTF8String];
    unsigned char digest[CC_MD5_DIGEST_LENGTH];
    CC_LONG len =(CC_LONG)strlen(cStr);
    CC_MD5(cStr, len, digest );
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02x", digest[i]];
    return  output;
}

-(NSString *) buildMsgMd5Str:(NSDictionary *) dis{
    NSMutableString *msgMd5Str = [[NSMutableString alloc] initWithString:@""];
    NSArray *keys = [dis allKeys];
    NSArray *newKeys = [keys sortedArrayUsingSelector:@selector(compare:)];
    NSError *error ;
    for (NSString *key in newKeys) {
        [msgMd5Str appendString:key];
        [msgMd5Str appendString:@"="];

        NSString *temp = (NSString *)[dis objectForKey:key];

        if(   [[dis objectForKey:key]  isKindOfClass:[NSString class]]) {
            [msgMd5Str appendString:temp];
        }else if(  [  [dis objectForKey:key] isKindOfClass:[NSNumber class]  ] )  {
            //  [msgMd5Str appendString:temp];
            [msgMd5Str appendString:[[dis objectForKey:key] stringValue]];
        }else if ( [  [dis objectForKey:key] isKindOfClass:[NSDictionary class]  ] ||
                  [  [dis objectForKey:key] isKindOfClass:[NSArray class]  ])  {

            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:[dis objectForKey:key] options:0 error:&error];

            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

            [msgMd5Str appendString: jsonString];
        }else{
            NSLog(@"other type");
        }
    }
    return msgMd5Str;
}

-(NSString *) buildMd5Str:(NSString *) cmd machId:(NSString *) machId msg:(NSString *) msg{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSMutableString *md5String = [[NSMutableString alloc] initWithString:@""];
    [md5String appendString: cmd];
    [md5String appendString:[self getIp]];
    [md5String appendString:machId];
    [md5String appendString:[[UIDevice currentDevice] model]];
    [md5String appendString:msg];
    [md5String appendString:platform];
    [md5String appendString:sid];
    [md5String appendString:[infoDictionary objectForKey:@"CFBundleShortVersionString"]];
    [md5String appendString:[[UIDevice currentDevice] systemVersion]];
    [md5String appendString:sidKey];

    NSLog(@"md5Str=%@",md5String);
    return md5String;

}


-(NSString *) buildHttpParam:(NSDictionary *) dis{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];

    NSString *md5Str = [self md5:[self buildMd5Str:[dis objectForKey:@"cmd"]
                                            machId:[dis objectForKey:@"machId"]
                                               msg:[self buildMsgMd5Str:[dis objectForKey:@"msg"]]]
                        ];

    NSDictionary *paramObj = [NSDictionary dictionaryWithObjectsAndKeys:
                              sid,@"sid",
                              platform,@"platform",
                              [dis objectForKey:@"cmd"],@"cmd",
                              [dis objectForKey:@"func"],@"func",
                              [dis objectForKey:@"machId"],@"machId",
                              [[UIDevice currentDevice] model],@"machName",
                              [infoDictionary objectForKey:@"CFBundleShortVersionString"],@"softVer",
                              [[UIDevice currentDevice] systemVersion],@"sysVer",
                              [dis objectForKey:@"token"],@"token",
                              [self getIp],@"ip",
                              md5Str,@"md5",
                              [dis objectForKey:@"msg"],@"msg",
                              nil];

    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:paramObj
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:nil];

    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    return jsonString;
}


- (NSString *) getIp{
    NSString *address = @"error";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    success = getifaddrs(&interfaces);
    if (success == 0)
    {
        temp_addr = interfaces;
        while(temp_addr != NULL)
        {
            if(temp_addr->ifa_addr->sa_family == AF_INET)
            {
                if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"])
                {
                    address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
                }
            }
            temp_addr = temp_addr->ifa_next;
        }
    }
    freeifaddrs(interfaces);
    return address;
}

@end

