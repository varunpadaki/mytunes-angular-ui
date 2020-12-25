import { Injectable } from '@angular/core';
import { CityVO } from './CityVO';
import { RoleVO } from "./RoleVO";

@Injectable({
    providedIn: 'root'
  })
export class UserData{
    private id: string;
    private firstName: string;
    private lastName: string;
    private phoneNumber: number;
    private middleName: string;
    private gender: string;
    private dateOfBirth: Date;
    private username: string;
    private password: string;
    private emailId: string;
    private cityVO: CityVO;
    private userAuthorities: Set<RoleVO>;
    private address: string;
    private accountLockedFlag: string;
    private userEnabledFlag: string;
    private cityId: string;
    private roleIdList: string[];

    constructor(){}

    public getId(): string {
        return this.id;
    }
    public setId(id: string) {
        this.id = id;
    }
    
    public getFirstName(): string {
        return this.firstName;
    }
    public setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }
    public setLastName(lastName: string) {
        this.lastName = lastName;
    }
    
    public getPhoneNumber(): number {
        return this.phoneNumber;
    }
    public setPhoneNumber(phoneNumber: number) {
        this.phoneNumber = phoneNumber;
    }
    
    public getMiddleName(): string {
        return this.middleName;
    }
    public setMiddleName(middleName: string) {
        this.middleName = middleName;
    }
    
    public getGender(): string {
        return this.gender;
    }
    public setGender(gender: string) {
        this.gender = gender;
    }
    
    public getDateOfBirth(): Date {
        return this.dateOfBirth;
    }
    public setDateOfBirth(dateOfBirth: Date) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public getUsername(): string {
        return this.username;
    }
    public setUsername(username: string) {
        this.username = username;
    }
    
    public getPassword(): string {
        return this.password;
    }
    public setPassword(password: string) {
        this.password = password;
    }
    
    public getEmailId(): string {
        return this.emailId;
    }
    public setEmailId(emailId: string) {
        this.emailId = emailId;
    }
    
    public getCityVO(): CityVO {
        return this.cityVO;
    }
    public setCityVO(cityVO: CityVO) {
        this.cityVO = cityVO;
    }
    
    public getUserAuthorities(): Set<RoleVO> {
        return this.userAuthorities;
    }
    public setUserAuthorities(userAuthorities: Set<RoleVO>) {
        this.userAuthorities = userAuthorities;
    }
    
    public getAddress(): string {
        return this.address;
    }
    public setAddress(address: string) {
        this.address = address;
    }

    public getAccountLockedFlag(){
        return this.accountLockedFlag;
    }

    public setAccountLockedFlag(accountLockedFlag: string){
        this.accountLockedFlag = accountLockedFlag;
    }

    public getUserEnabledFlag(){
        return this.userEnabledFlag;
    }

    public setUserEnabledFlag(userEnabledFlag: string){
        this.userEnabledFlag = userEnabledFlag;
    }

    public getCityId(){
        return this.cityId;
    }

    public setCityId(cityId: string){
        this.cityId = cityId;
    }

    public getRoleIdList(){
        return this.roleIdList;
    }

    public setRoleIdList(roleIdList: string[]){
        this.roleIdList = roleIdList;
    }
}