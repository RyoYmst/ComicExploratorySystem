#!/opt/local/bin/pythonw2.7
#coding:utf-8

import cgi
import cgitb
cgitb.enable()
import MeCab
import numpy
import codecs
import os
import math
import collections
import json
import codecs

def calcTF(input_like_genre):
    tf = {}
    for i in input_like_genre:
        if not tf.has_key(i):
            tf[i] = 0
        tf[i] += 1
    return tf


def ExpectLikeComic(comic_data):
    data = []
    for i in comic_data:
        for j in i["genres"]:
            if j in tf.keys():
                data.append(i)
                break
    return data


def DbGenre(data):
    all_genres_list = []
    for i in data:
        all_genres_list.extend(i["genres"])
    put_in_order = set(all_genres_list)
    return put_in_order


def calcDF(expect_like_comics,all_genres):
    data = []
    for i in range(0,len(expect_like_comics)):
        df = {}
        df["title"] = expect_like_comics[i]["title"]
        vec = []
        genres = []
        for j in range(0,len(list(all_genres))):
            if list(all_genres)[j] in expect_like_comics[i]["genres"]:
                vec.append(1)
                df["genres"] = expect_like_comics[i]["genres"]
                #genres.append(expect_like_comics[i]["genre"])
            else:
                vec.append(0)
        df["vec"] = vec
        #df["genres"] = genres
        data.append(df)
    return data


def input_calcDF(tf,all_genres):
    df = collections.OrderedDict()
    for i in range(0,len(all_genres)):
        for k,v in tf.items():
            if list(all_genres)[i] == k:
                df[list(all_genres)[i]] = v
                break
            else:
                df[list(all_genres)[i]] = 0
    return df


def ExpectBestLikeComic(data):
    for i in range(0,len(data)):
        most_near_comic = 0
        if most_near_comic < data[i]["similarity"]:
            most_near_comic = data[i]["similarity"]
    
    for i in range(0,(len(data))):
        if data[i]["similarity"] == most_near_comic:
            return data[i]


def calcCos(df,input_df):
    input_data_vec = numpy.array(input_df.values())
    for i in range(0,len(df)):
        each_comic_vec = numpy.array(df[i]["vec"])
        calc_result = numpy.dot(input_data_vec,each_comic_vec)/(math.sqrt(numpy.dot(input_data_vec,input_data_vec)) * math.sqrt(numpy.dot(each_comic_vec,each_comic_vec)))
        df[i]["similarity"] = calc_result
    select_comic = ExpectBestLikeComic(df)
    return select_comic


def Conversion(data):
    convert_data = []
    for i in range(0,len(data)):
        tmp_each_comic = collections.OrderedDict()
        tmp_genre = []
        tmp_each_comic["title"] = data[i]["title"].encode("utf-8")
        for j in range(0,len(data[i]["genres"])):
            tmp_genre.append(data[i]["genres"][j].encode("utf-8"))
        tmp_each_comic["genres"] = tmp_genre
        convert_data.append(tmp_each_comic)
    return convert_data

def Split(all_data):
    split_comic = all_data.split(",")
    return split_comic

def GetData(data,json_data):
    split_comic = Split(data)
    input_like_genre_list = []
    for i in range(0,len(split_comic)):
        input_like_genre = {}
        for j in range(0,len(json_data)):
            if split_comic[i] == json_data[j]["title"]:
                input_like_genre["title"] = split_comic[i]
                input_like_genre["genres"] = json_data[j]["genres"]
        input_like_genre_list.append(input_like_genre)
    return input_like_genre_list

def InputLikeGerne(data):
    like_genres = []
    for i in range(0,len(data)):
        for j in range(0,len(data[i]["genres"])):
            like_genres.append(data[i]["genres"][j])
    adjustment_like_genres = set(like_genres)
    return adjustment_like_genres

if __name__ == "__main__":
    
    form = cgi.FieldStorage()
    #print "Content-Type: text/html; charset: utf-8\n"
    f = open("../data/data.json","r")
    jsondata = json.load(f)
    jsondata_conversion = Conversion(jsondata)
    data = GetData(form["query"].value,jsondata_conversion)#Unicode変換
    input_like_genre = InputLikeGerne(data)#入力された好きなコミックを元に好きなジャンルを取得
    tf = calcTF(input_like_genre)#好きな漫画のジャンル数のTF
    all_genres = DbGenre(jsondata_conversion)#データベースに格納されているコミックの全ジャンルをリスト化
    expect_like_comics = ExpectLikeComic(jsondata_conversion)#好きな漫画に登録されているジャンルが含まれる漫画
    df = calcDF(expect_like_comics,all_genres)#DB内のコミックの特徴を取得(df値)
    input_df = input_calcDF(tf,all_genres)#入力データのDF(ユーザの嗜好)
    calc_cos = calcCos(df,input_df)
    print "Content-Type: application/json charset:utf-8 \n"
    print json.dumps(calc_cos)

