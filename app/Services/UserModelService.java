/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Services;

import dto.*;
import models.Account;
import org.mindrot.jbcrypt.BCrypt;
import java.util.*;

/**
 * UserControllerとDBの接続部部の処理をする
 * @author y-aiyoshizawa
 * 
 */
public class UserModelService {
    
    /**
     * 処理後のメッセージを保存するメンバ変数
     */
    public String message;
    
    /**
     * ログイン判定
     * @param entry
     * @return null,それ以外ならUser
     */
    public Account login(LoginUser entry){
        message = "";
        
        // ログインIDでヒットするかつ削除されていないものを検索
        Account user = Account.find.where().eq("userName", entry.userId).ne("isDelete", 0).findUnique();
        //user_idが見つからない
        if(user == null){
            message = "IDかPasswordまたはその両方が間違っています";
            return null; 
        }

        //passwordの比較
        String dbpw = user.password;
        if(!BCrypt.checkpw(entry.password, dbpw)){
            message = "IDかPasswordまたはその両方が間違っています";
            return null;
        }
        return user;
    }

    /**
     * 
     * deleteFlagが立っていないユーザー一覧を返す
     * 
     * @param id
     * @return ユーザーリスト
     */
    public List<Account> getUserList(Long id){
        message = "";
        List<Account> userList = Account.find.where().ne("isDelete", 0).ne("id", id).findList();
        if(userList.isEmpty()){
            message = "削除できるUserが見つかりませんでした";
            return null;
        }
        return userList;
    }
    
    /**
     * createUserをuserに変換しDBに保存する
     * @param createUser
     * @return エラー:null,更新成功:User
     */
    public Account cureateUser(CreateUser createUser){
        message = "";
        
        if(!createUser.password.equals(createUser.confirmPassword)){
            message = "ConfirmPasswordと一致しません";
            return null;
        }
        if(Account.find.where().eq("userName",createUser.userId).findRowCount() >= 1){
            message = "既に存在するIDです";
            return null;
        }
        Account user = new Account();
        user.userName = createUser.userId;
        user.password = createUser.password;
        user.fullName = createUser.nickName;
        user.passwordHashSave();
        message = "User登録が成功しました";
        return user;
    }
    
    /**
     * idで引っ張ってきたデータを元にditUserで上書きする
     * @param id
     * @param editUser
     * @return エラー:null,更新成功:User
     */
    public Account updateUser(Long id,EditUser editUser){
        message = "";
        Account user = Account.find.byId(id);
        if(user == null){
            message = "Userが見つかりません";
            return null;
        }
        //ユーザーIDに変更がある時、そのUserIDが既に存在するかどうか
        if(!user.userName.equals(editUser.userId) && Account.find.where().eq("userName",editUser.userId).findRowCount() >= 1){
            message = "変更しようとしているUserは既に存在します";
            return null;
        }
        
        user.userName = editUser.userId;
        user.fullName = editUser.nickName;
        user.update();
        
        message = "User変更が成功しました";
        return user;
    }
    
    /**
     * パスワードの変更の更新
     * @param id
     * @param editUserPassword
     * @return エラー:null,更新成功:User
     */
    public Account updatePasswordUser(Long id, EditUserPassword editUserPassword) {
        message = "";
        Account user = Account.find.byId(id);
        if(user == null){
            message = "Userが見つかりません";
            return null;
        }
        if(!editUserPassword.newPassword.equals(editUserPassword.confirmPassword)) {
            message = "ConfirmPasswordと一致しません";
            return null;
        }
        if(!BCrypt.checkpw(editUserPassword.oldPassword,user.password)) {
            message = "OldPasswordが間違っています";
            return null;
        }        
        
        user.password = editUserPassword.newPassword;
        user.passwordHashUpadate();
        
        message = "User変更が成功しました";
        return user;
    }
    
    /**
     * idをもらい論理削除する
     * @param id
     * @return idが見つからない:null,削除成功:User
     */
    public Account deleteUser(Long id){
        message = "";
        Account user = Account.find.byId(id);
        if(user == null){
            message = "Userが見つかりません";
            return null;
        }
        
        user.isDelete = 0;
        user.update();
        
        message = "User削除が成功しました";
        return user;
    }
}
