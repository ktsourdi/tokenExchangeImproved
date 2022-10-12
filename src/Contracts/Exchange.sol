// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract TokenSwap {
    
    //create state variables
    
    IERC20 public token1;
    IERC20 public token2;
    IERC20 public token3;

    mapping(IERC20 => uint256) public rates;
    

    //when deploying pass in owner 1 and owner 2
    
    constructor(
        address _token1,
        address _token2,
        address _token3
        
        )  {
            token1 = IERC20(_token1);
            token2 = IERC20(_token2);
            token3 = IERC20(_token3);
            rates[token1] = 1; 
            rates[token2] = 10; 
            rates[token3] = 100;
        }
        


    function swap(IERC20 _token1, IERC20 _token2, uint _amount1, uint _amount2) public {
        require((_amount1/_amount2 == rates[_token1]/rates[_token2]),"Insufficient Balance"); 
            _token1.transferFrom(msg.sender, address(this), _amount1);
            _token2.transferFrom(address(this), msg.sender, _amount2);
            
    }

    function returnRate(IERC20 index) public returns (uint256){
        return rates[index];
    }


    address[] internal stakeholders;
    mapping(address => uint256) internal stakes1;
    mapping(address => uint256) internal stakes2;
    mapping(address => uint256) internal stakes3;

    function isStakeholder(address _address)
        public
        view
        returns(bool, uint256)
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    function addStakeholder(address _stakeholder)
        public
    {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }
    
    function removeStakeholder(address _stakeholder)
       public
    {
       (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
       if(_isStakeholder){
           stakeholders[s] = stakeholders[stakeholders.length - 1];
           stakeholders.pop();
       }
    }

    function stakeOf(uint index, address _address)
       public
       view
       returns(uint)
    {
       if(index == 1) {return stakes1[_address]; }
       else if (index == 2) {return stakes2[_address];}
       else if (index == 3) {return stakes3[_address];}
    }

    function createStake(uint256 index, uint256 _stake) public
    {
        if(index == 1) {
            token1.transferFrom(msg.sender, address(this), _stake);
            if(stakes1[msg.sender] == 0) addStakeholder(msg.sender);
            stakes1[msg.sender] = stakes1[msg.sender]+= (_stake);
        }
        else if (index == 2) {
            token2.transferFrom(msg.sender, address(this), _stake);
            if(stakes2[msg.sender] == 0) addStakeholder(msg.sender);
            stakes2[msg.sender] = stakes2[msg.sender]+= (_stake);
        }
        else if (index == 3) {
            token3.transferFrom(msg.sender, address(this), _stake);
            if(stakes3[msg.sender] == 0) addStakeholder(msg.sender);
            stakes3[msg.sender] = stakes3[msg.sender]+= (_stake);
        }
    }

   function removeStake() public
    {
        {
            token1.transfer(msg.sender, stakes1[msg.sender]);
            stakes1[msg.sender] = stakes1[msg.sender] -= stakes1[msg.sender];
            if(stakes1[msg.sender] == 0) removeStakeholder(msg.sender);
        }

        {
            token2.transfer(msg.sender, stakes2[msg.sender]);
            stakes2[msg.sender] = stakes2[msg.sender] -= stakes2[msg.sender];
            if(stakes2[msg.sender] == 0) removeStakeholder(msg.sender);
        }

        {
            token3.transfer(msg.sender, stakes3[msg.sender]);
            stakes3[msg.sender] = stakes3[msg.sender] -= (stakes3[msg.sender]);            
            if(stakes3[msg.sender] == 0) removeStakeholder(msg.sender);
        }
    }   

}