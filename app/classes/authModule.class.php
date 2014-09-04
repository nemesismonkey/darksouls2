<?php
	class authModule {
		public $user;
		public $name;
		public $authenticated;
		public $isLoggedIn;
		public $allowUpload;
		private $realm;
		private $app;
		private $country;
		private $errors;
		private $post;
		private $proccessed;
		private $msize;
		public $imageh;
		private $maxlength;
		private $userOB;
		private $userTK;
		private $failed_table;
		private $timeago;
		private $expires;
		public $showmsg;
		//private tmp data holder for logins
		//will be a pdo data object returned from database
		private $d;
		
		public function __construct(appCore $appCore) {
			
			$this->app = $appCore;
			$this->allowUpload = false;
			$this->proccessed = false;
			$this->msize = appCore::MAX_UPLOAD_SIZE;
			$this->imageh = null;
			$this->maxlength = 250;
			
			$this->userOB = substr(md5('user'),0,15);
			$this->userTK = substr(md5('token'),0,15);
			
			$this->failed_table = 'failed_logins';
			$this->user_table = $this->app->userTable;
			
			$this->user = null;
			$this->name = null;
			$this->email = null;
			$this->authenticated = false;
			
			$this->timeago = date('Y-m-d H:i:s', strtotime('-30 minutes'));
			$this->errors = array();
			$this->expires = time() + (60 * 60 * 24 * 7);
			
			
			$this->isLoggedIn = $this->validateLogin();
			
			$this->showmsg = true;
			
		}
		
		
		public function return_login_form($openTag = true,$endTag = true,$url = '',$includeSingin = true, $incname = true){
			$str = '';
			
			if(!$this->proccessed)
				$this->proccessData();
			//$str .= '<div>'.count($this->errors).' errors found when trying to singup</div>';
			
			if($openTag)
				$str .= '<form name="cocktail_with_login" method="post" action="'.$url.'" enctype="multipart/form-data">
				<input type="hidden" name="lin" value="1" />';
				
				$str .= '<div class="login_form mobile-add-back">
				
					<div class="bform grid-parent clearfix" >'.($includeSingin ? '
						
						<h2>Login</h2><hr class="nmarg" />
						
						'.($this->showmsg ? '<p>If you previously registered, you can save time by logging in with your email and password below. </p>' : '').'
						<div class="grid-100 mobile-grid-100">
						'.$this->iserr(':attempts',$this->errors).'
						'.$this->iserr(':failed_login',$this->errors).'
						'.$this->iserr(':pdo',$this->errors).'</div>
						<div class="grid-40 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-30 mobile-grid-100">
									<label for="email">Email</label> 
								</div>
								<div class="grid-70 mobile-grid-100">
									<input type="text" class="login_f" name="email" id="email" value="'.$this->isnerr('email').'" maxlength="'.$this->maxlength.'" />
								</div>
							</div>
							<div class="grid-70 push-30 mobile-grid-100">'.$this->iserr(':email',$this->errors).'</div>
						</div>
						<div class="grid-40 push-5 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-30 mobile-grid-100">
									<label for="pass">Password</label> 
								</div>
								<div class="grid-70 mobile-grid-100">
									<input type="password" class="login_f" name="pass" id="pass" value="'.$this->isnerr('pass').'" maxlength="'.$this->maxlength.'" />
								</div>
							</div>
							<div class="grid-70 push-30 mobile-grid-100">'.$this->iserr(':pass',$this->errors).'</div>
						</div>
						
						<!-- <div class="clear"></div> -->
						
						<div class="grid-15 push-5 mobile-grid-100">
							<div class="grid-ui"><input type="submit" name="login" value="Go" /></div>
						</div>
						
						<div class="clear"></div>
						' : '');
						
						if(!$incname){
							$str .= '</div></div></form>';
							return $str;
							
						}
					$str .=	'

						<h2>Registration</h2><hr class="nmarg" />
						
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="fname">Name</label></div>
								<div class="grid-45 mobile-grid-100"><input type="text" class="login_f" name="fname" id="fname" value="'.$this->isnerr('fname').'" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':fname',$this->errors).'
							</div>
						</div>
						
						<div class="clear"></div>
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="remail">Email</label> </div>
								<div class="grid-45 mobile-grid-100"><input type="text" class="login_f" name="remail" id="remail" value="'.$this->isnerr('remail').'" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':emailinuse',$this->errors).'
								'.$this->iserr(':remail',$this->errors).'
							</div>
						</div>
						
						<div class="clear"></div>
						
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="company">Bar</label></div>
								<div class="grid-45 mobile-grid-100"><input type="text" class="login_f" name="company" id="company" value="'.$this->isnerr('company').'" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':company',$this->errors).'
							</div>
						</div>
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="location">Location</label></div>
								<div class="grid-45 mobile-grid-100"><input type="text" class="login_f" name="location" id="location" value="'.$this->isnerr('location').'" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':location',$this->errors).'
							</div>
						</div>
						
						<div class="clear"></div>
						
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="hshot">Head Shot</label> <span class="small" style="line-height: 28px;">(optional)</span></div>
								<div class="grid-80 mobile-grid-100"><span class="image-file"> <label for="hshot"><img src="'.REL_PATH.'css/plus.png" class="plus" alt="Select Image" /></label> <input type="file" class="login_f" name="hshot" id="hshot" /> </span> </div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':hshot',$this->errors).'
							</div>
						</div>
						<div class="clear"></div>
						
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="rpass">Password</label></div> 
								<div class="grid-45 mobile-grid-100"><input type="password" class="login_f" name="rpass" id="rpass" value="'.$this->isnerr('rpass').'" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':rpass',$this->errors).'
							</div>
						</div>
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="crpass">Confirm Pass</label> </div>
								<div class="grid-45 mobile-grid-100"><input type="password" class="login_f" name="crpass" id="crpass" value="'.$this->isnerr('crpass').'" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':crpass',$this->errors).'
							</div>
						</div>
						
						<div class="grid-100 mobile-grid-100">
					
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="question1">Why would you like to win the Stoli Cocktail Dream Library? </label></div>
								<div class="grid-80 mobile-grid-100"><textarea name="question1" id="question2" class="w100" rows="3" maxlength="'.($this->maxlength*10).'">'.$this->isnerr('question1').'</textarea></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':question1',$this->errors).'
							</div>
						</div>
						
					</div>
					
				</div>';
			
				
			if($endTag)
				$str .= '<div class="grid-100 mobile-grid-100">
							<div class="grid-ui"><input type="submit" name="login" value="Signup" /></div>
						</div></form>';
				
			return $str;
				
		}
		
		public function returnPseudoForm($edit = false,$id = false) {
			$this->id = $id;
			if((isset($_POST['createp']) && !$edit) || (isset($_POST['editp']) && $edit)) {
				$data = $this->returnPdata();
				
				if($this->allowUpload) {
					
					$ip = appCore::getIp();
					$n = array(':fname'=>$data['fname'],':company'=>$data['company'],':location'=>$data['location'],':ip1'=>$ip[0],':ip2'=>$ip[1]);
					
		
					$q = 'INSERT INTO '.$this->user_table.' (`first_name`,`location`,`company`,`account_status`,`ip1`,`ip2`,`pseudo`) 
					VALUES(
					:fname,
					:location,
					:company,
					7,
					:ip1,
					:ip2,
					1)';
					
					if($edit) {
						unset($n[':ip1'],$n[':ip2']);
						
						if(is_object($this->imageh) && $this->imageh->isvalid()) {
							$todel = $this->app->pdo_call('SELECT headshot_link, hshot_lar, hshot_mid, hshot_small FROM '.$this->user_table.' WHERE id='.$this->id.' LIMIT 1');
							$todel = $todel[0];
							if(file_exists(REL_PATH.$todel->headshot_link))
								unlink(REL_PATH.$todel->headshot_link);
							if(file_exists(REL_PATH.$todel->hshot_lar))
								unlink(REL_PATH.$todel->hshot_lar);
							if(file_exists(REL_PATH.$todel->hshot_mid))
								unlink(REL_PATH.$todel->hshot_mid);
							if(file_exists(REL_PATH.$todel->hshot_small))
								unlink(REL_PATH.$todel->hshot_small);
						}
						
						$q = 'UPDATE '.$this->user_table.' SET `first_name`=:fname,`location`=:location,`company`=:company,headshot_link="", hshot_lar="", hshot_mid="", hshot_small="" 
							WHERE id='.$this->id.' LIMIT 1';
					}
					$pdo = $this->app->open_new_pdo();
						
					$insert = $pdo->prepare($q);
					$insok = $insert->execute($n);
					$insert->closeCursor();
					
					if($insok) {
						if(!$edit) {
							$id = $this->app->pdo_call('SELECT id FROM '.$this->user_table.' WHERE `first_name`="'.mysql_escape_string($n[':fname']).'" ORDER BY id DESC LIMIT 1');
							$id = $id[0]->id;
						} else
							$id = $this->id;
						
						$d = new stdClass;
						$this->d = $d;
						$this->d->id = $id;
						
						$dir = './assets/users/'.base_convert($id,10,32);
						if(!$edit) {
							mkdir($dir,0777,true);
							mkdir($dir.'/cocktails',0777,true);
							mkdir($dir.'/photos',0777,true);
							mkdir($dir.'/originals/photos',0777,true);
							mkdir($dir.'/originals/cocktails',0777,true);
						}
						
						$this->uploadHshot($dir,$pdo);
					}
					return $str = 'Pseudo user '.($edit ? 'edited ' : 'added ').' successfully';
				}
			}
			
			
			if($edit) {
				$e = $this->app->pdo_call('SELECT id,first_name,location,company,hshot_small FROM '.$this->app->userTable.' WHERE id='.$id.' LIMIT 1');
				$e = $e[0];
			}
			
			$str = '<h2>'.($edit ? 'Editing ' : 'Adding ').'a pseudo user</h2><form name="pseudo_create" method="post" action="'.appCore::curPageURL().'" enctype="multipart/form-data">
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="fname">Name</label></div>
								<div class="grid-45 mobile-grid-100"><input type="text" class="login_f" name="fname" id="fname" value="';
							$hlv = $this->isnerr('fname');
							if($hlv == '' && $edit)
								$hlv = $e->first_name;					
							$str .= $hlv . '" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':fname',$this->errors).'
							</div>
						</div>
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="company">Bar</label></div>
								<div class="grid-45 mobile-grid-100"><input type="text" class="login_f" name="company" id="company" value="';
							$hlv = $this->isnerr('company');
							if($hlv == '' && $edit)
								$hlv = $e->company;		
							$str .= $hlv . '" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':company',$this->errors).'
							</div>
						</div>
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="location">Location</label></div>
								<div class="grid-45 mobile-grid-100"><input type="text" class="login_f" name="location" id="location" value="';
							
							$hlv = $this->isnerr('location');
							if($hlv == '' && $edit)
								$hlv = $e->location;		
							$str .= $hlv . '" maxlength="'.$this->maxlength.'" /></div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':location',$this->errors).'
							</div>
						</div>
						
						<div class="grid-100 mobile-grid-100">
							
							<div class="grid-ui">
								<div class="grid-20 mobile-grid-100"><label for="hshot">Head Shot</label> <span class="small" style="line-height: 28px;">(optional)</span></div>
								<div class="grid-80 mobile-grid-100"><span class="image-file"> <label for="hshot"><img src="'.REL_PATH.'css/plus.png" class="plus" alt="Select Image" /></label> <input type="file" class="login_f" name="hshot" id="hshot" /> </span>
									'.($edit && !empty($e->hshot_small) ? '<a href="'.REL_PATH.$e->hshot_small.'" target="_blank">current</a>' : '').'
								</div>
							</div>
							<div class="grid-100 mobile-grid-100">
								'.$this->iserr(':hshot',$this->errors).'
							</div>
						</div>
						<div class="grid-100 mobile-grid-100">
							<div class="grid-ui"><input type="submit" '.($edit ? 'name="editp" value="Edit User"' : 'name="createp" value="Make User"').' /></div>
						</div></form>';
			
			return $str;
		}
		public function proccessData(){
			$this->country = new country;
			$this->proccessed = true;

			$this->post = $this->returnPostData();
		
			$this->errors = $this->returnErrors($this->post);
			
			if(count($this->errors) > 0)
				$this->allowUpload = false;
			
			if(is_array($this->post) && count($this->post) != 0 && count($this->errors) == 0)
				$this->allowUpload = true;
			
		}
		
		private function returnPdata(){
			if(isset($_FILES['hshot']))
			$_POST['hshot'] = $_FILES['hshot'];
			
			$this->errors = $this->returnErrors($_POST);
			
			if(count($this->errors) > 0)
				$this->allowUpload = false;
			
			if(is_array($_POST) && count($_POST) != 0 && count($this->errors) == 0)
				$this->allowUpload = true;
				unset($_POST['createp']);
				return $_POST;
		}
		
		private function validateLogin(){
			
			if(isset($_SESSION[$this->userOB]) && isset($_SESSION[$this->userTK])){
				$this->setSessionData();
				return true;
				
			}
			if(!isset($_COOKIE[$this->userOB]) && !isset($_COOKIE[$this->userTK])){
				return false;
			}else {
				$this->post = array('email'=>$_COOKIE[$this->userOB],'key'=>$_COOKIE[$this->userTK]);
				if($this->isRealUser())
					$this->logMeIn(false);
				else
					return false;
			}
			return true;
		}
		
		private function setSessionData(){
			
			$this->email = $_SESSION[$this->userOB];

			
			$this->user = $_SESSION['user_id'];
			$this->name = $_SESSION['name'];
			
			$this->authenticated = $_SESSION['status'];
			$this->allowUpload = true;
		}
		
		public function addUser() {
			$data = array();

			foreach($this->post as $key => $val){
				$data[':'.$key] = $val;
			}
			
			$data[':rpass'] = $this->rectify($data[':rpass']);
			$data[':enc'] =  $this->rectify($data[':remail']);
			$data[':status'] = 1;
			
			$hshot_store = $data[':hshot'];
			
			unset($data[':crpass'],$data[':drinkname'],$data[':sdesc'],$data[':lineingr'],$data[':instructions'],$data[':question2'],$data[':submit'],$data[':hshot'],$data[':login']); //$data[':question1'],
			
			
			$ip = appCore::getIp();
			$data[':ip1'] = $ip[0];
			$data[':ip2'] = $ip[1];
			
				$already = 'SELECT COUNT(*) as c,id FROM '.$this->user_table.' WHERE email = :remail LIMIT 1';
				
				
				//$statement = 'INSERT INTO '.$this->user_table.' (`first_name`,`mid_name`,`last_name`,`email`,`occupation`,`company`,`country_iso`,`zipcode`,`password`,`user_enc`,`account_status`,`ip1`,`ip2`) 
				$statement = 'INSERT INTO '.$this->user_table.' (`first_name`,`email`,`location`,`company`,`password`,`user_enc`,`account_status`,`ip1`,`ip2`,`question1`) 
				VALUES(
					:fname,
					:remail,
					:location,
					:company,
					:rpass,
					:enc,
					:status,
					:ip1,
					:ip2,
					:question1)';
					
				/*:fname,
					:mname,
					:lname,
					:remail,
					:occupation,
					:company,
					:country_code,
					:zipcode,
					:rpass,
					:enc,
					:status,
					:ip1,
					:ip2)*/
				
			$pdo = $this->app->open_new_pdo();
			
			if(!is_object($pdo)){
				$this->errors[':pdo'] = "There was an error making the database connection";
				return false;
				
			}
				
			$tmp = $pdo->prepare($already);
			
			$tmp->execute(array(':remail'=>$data[':remail']));
			
			$alreadyAuser = $tmp->fetchAll( PDO::FETCH_OBJ );
			$tmp->closeCursor();

			if($alreadyAuser[0]->c != 0){
				$this->errors[':emailinuse'] = "Email is already in use";
				return false;
			}

			$tmp = $pdo->prepare($statement);
			$suc = $tmp->execute($data);
			$tmp->closeCursor();
			
			if(!$suc) {
				$this->errors[':pdo'] = 'Failed to add user to database';
				return false;
			}
			
			$tmp = $pdo->prepare($already);
			
			$newuser = $tmp->execute(array(':remail'=>$data[':remail']));
			
			if(!$newuser){
				$this->errors[':pdo'] = 'Failed to retrieve user credentials from database';
				return false;
			}
			
			$newuser = $tmp->fetchAll( PDO::FETCH_OBJ );
			$tmp->closeCursor();
			
			$d = new stdClass;
			
			$d->email = $data[':remail'];
			$d->id = $newuser[0]->id;
			$d->account_status = $data[':status'];
			$d->first_name = $data[':fname'];
			$this->d = $d;
			
			$dir = './assets/users/'.base_convert($d->id,10,32);
			mkdir($dir,0777,true);
			mkdir($dir.'/cocktails',0777,true);
			mkdir($dir.'/photos',0777,true);
			mkdir($dir.'/originals/photos',0777,true);
			mkdir($dir.'/originals/cocktails',0777,true);
			
			//mkdir($data[':mkdir'],0755,true);
			
			
			$this->uploadHshot($dir,$pdo);
				
			
			return $this->logMeIn();

		}
		private function uploadHshot($dir,$pdo){
			if(is_object($this->imageh)){
				if($this->imageh->isvalid()){
					$dir = substr( $dir,2);
					$this->imageh->imageRoot = $dir.'/originals/photos/';
					$this->imageh->thumbRoot = $dir.'/photos/';
					
					$newData = Array();
					
					$sizes = $this->app->thumbSizes;
					
					$newData[':small'] = $this->imageh->generate_thumb(true,true,$this->app->hshotSize,$this->app->hshotSize);
					$newData[':mid'] = $this->imageh->generate_thumb(true,true,$sizes['medium'],$sizes['medium']);
					$newData[':lar'] = $this->imageh->generate_thumb(true,true,$sizes['large'],$sizes['large']);
					
					chmod($newData[':small'],0755);
					chmod($newData[':mid'],0755);
					chmod($newData[':lar'],0755);
					
					$this->imageh->passThrough = true;
					$newData[':full'] = $this->imageh->generate_thumb(false,true);
					
					chmod($newData[':full'],0755);
					
					$newData[':id'] = $this->d->id;
					
					$setPhotos = 'UPDATE '.$this->user_table.' SET headshot_link = :full ,hshot_lar = :lar, hshot_mid = :mid, hshot_small= :small WHERE `id`= :id';
					
					$tmp = $pdo->prepare($setPhotos);
					$tmp->execute($newData);
				} 
			}
		}
		public function return_success(){
			return '<div class="grid-100 mobile-grid-100">
						<h2>Account Successfully created</h2>
					</div>';
		}
		public function return_fail(){
			print_r($this->errors);
			return '<div class="grid-100 mobile-grid-100">
						<h2>Account failed to be created</h2>
						<p>Could not add to database...</p>
					</div>';
		}
		public function isRealUser($lin = false,$turl = REL_PATH){
			if(!isset($this->post['email']))
				return false;
			
			if(count($this->errors) != 0){
				$this->errors[':unspec'] = "An unspecified error has accured";
				return false;
			}
				
			$pdo = $this->app->open_new_pdo();
			
			if(!is_object($pdo))
				return $pdo;
				
			$ip = appCore::getIp();
			
			$failedAttempts = $pdo->query('SELECT COUNT(*) as c FROM '.$this->failed_table.' WHERE attempt_at > "'.$this->timeago.'" AND `ip`="'.$ip[0].'" AND `ip2`="'.$ip[1].'" GROUP BY `ip`,`ip2` ORDER BY attempt_at DESC LIMIT 0, 10');
			

			$count = $failedAttempts->fetchAll( PDO::FETCH_OBJ );
			if(is_array($count) && count($count) > 0 && $count[0]->c > 5) {
				$this->errors[':attempts'] = "Too many failed login attempts in the past 30 minutes, please wait";
				return false;
			}
			$failedAttempts->closeCursor();
			$failedAttempts = null;
			
			$dat = array(':email'=>$this->post['email']);
			$ps = '`password` = :pass';
			
			if(isset($this->post['key'])){
				unset($dat[':pass']);
				$dat[':key'] = $this->post['key'];
				
				$ps = '`user_enc` = :key';
				
			} else
			$dat[':pass'] = $this->rectify($this->post['pass']);
			
			$attempt = $pdo->prepare('SELECT id,first_name,email,account_status,COUNT(*) as c FROM '.$this->user_table.' WHERE `email` = :email AND '.$ps.' GROUP BY id LIMIT 1');
			
			
			
			
			$attempt->execute($dat);
			
			$success = $attempt->fetchAll( PDO::FETCH_OBJ );
			$attempt->closeCursor();
			$attempt = null;
			$pdo = null;
			if($success[0]->c == '1') {
				
				$this->d = $success[0];
				if($lin){
					$this->logMeIn();
					header('Location: '.$turl);
				}
				return true;
				
			} else
				if(!isset($this->post['key']))
				$this->addFailure();
				
			return false;

		}
		
		private function logMeIn($setCookies = true) {
			
			$rec = $this->rectify($this->d->email);
			
			$_SESSION[$this->userOB] = $this->email = $this->d->email;
			$_SESSION[$this->userTK] = $rec;
			
			$_SESSION['user_id'] = $this->user = $this->d->id;
			$_SESSION['name'] = $this->name = $this->d->first_name;
			
			$_SESSION['status'] = $this->authenticated = ($this->d->account_status == 10 ? true : false);
			
			if($setCookies) {
				setcookie($this->userOB, $this->d->email, $this->expires, '/', REL_DOMAIN,false,true);
				setcookie($this->userTK, $rec, $this->expires, '/', REL_DOMAIN,false,true);
			}
				return true;

		}
		public function logOut() {
			unset($_SESSION[$this->userOB],$_SESSION[$this->userTK],$_SESSION['user_id'],$_SESSION['name'],$_SESSION['status']);
			setcookie($this->userOB, null, time()-9000, '/', REL_DOMAIN);
			setcookie($this->userTK, null, time()-9000, '/', REL_DOMAIN);
		}
		private function rectify($val = null) {
			
			return hash('whirlpool',hash('ripemd160',appCore::SALT.$val.appCore::SALT).appCore::SALT);
		}
		
		private function addFailure() {
			$pdo = $this->app->open_new_pdo();
			
			if(!is_object($pdo))
				return $pdo;
			$ip = appCore::getIp();
			
			$failedAttempts = $pdo->query('INSERT INTO '.$this->failed_table.'(ip,ip2,attempt_to) VALUES("'.$ip[0].'","'.$ip[1].'","'.$this->post['email'].'")');

			
			$pdo = null;
			
			$this->errors[':failed_login'] = 'Login failed';
		}
		
		private function returnErrors($data) {
			if(!is_array($data))
				return array();
				
			$error = array();
			
			foreach($data as $key => $val) {
				
				if(!is_array($val))
				$val = trim($val);
				
				if(empty($val))
				switch($key){
					
			//Array ( [lin] => 1 [fname] => [mname] => [lname] => [remail] => [occupation] => [company] => [zipcode] => [rpass] => [crpass] => [login] => Signup ) 
					case('email'):
						$error[':'.$key] = 'Email is required to login';
					break;
					
					case('pass'):
						$error[':'.$key] = 'Pass is required to login';
					break;
					
					case('lin'):
						$error[':'.$key] = 'Data Tampering?';
					break;
					
					case('fname'):
						$error[':'.$key] = 'First Name is Required';
					break;
					
					case('lname'):
						$error[':'.$key] = 'Last Name is Required';
					break;
					
					case('remail'):
						$error[':'.$key] = 'Email is Required';
					break;
					/*
					case('occupation'):
						$error[':'.$key] = 'Occupation is Required';
					break;
					*/
					case('company'):
						$error[':'.$key] = 'Bar Name is Required';
					break;
					case('location'):
						$error[':'.$key] = 'Location is Required';
					break;
					/*
					case('country_code'):
						$error[':'.$key] = 'Country is Required';
					break;
					
					case('zipcode'):
						$error[':'.$key] = 'Zipcode is Required';
					break;
					*/
					case('rpass'):
						$error[':'.$key] = 'Pass is Required';
					break;
					
					case('crpass'):
						$error[':'.$key] = 'Confirm pass is Required';
					break;
					
					case('question1'):
						$error[':'.$key] = 'Required';
					break;
				}
				else
				switch($key){
					case('email'):
					case('remail'):
						if(!filter_var($val,FILTER_VALIDATE_EMAIL))
							$error[':'.$key] = 'Email is not valid';
					break;
					
					case('pass'):
					
						if(strlen($data['pass']) < 5)
							$error[':'.$key] = 'Password not long enough';
							
					break;
					
					case('fname'):
					case('mname'):
					case('lname'):
					case('occupation'):
					case('company'):
					case('question1'):
					case('location'):
					
						if(strlen($val) > $this->maxlength)
						$error[':'.$key] = 'Text entered is too long, '.$this->maxlength.' characters at most';
						
						$r = appCore::makeValidText($val);
						if(!$r)
						$error[':'.$key] = 'Text entered didnt validate as safe';
						
						
						
					break;
					
					case('country_code'):
						if(!$this->country->getCountry($val))
							$error[':'.$key] = 'Supplied Country code is not valid';
					break;
					
					case('zipcode'):
						if($this->country->isValidIso($data['country_code']))
							if(!$this->correctZip($val,$data['country_code']))
								$error[':'.$key] = 'Zipcode is Invalid';
						
						if(strlen($val) > $this->maxlength)
							$error[':'.$key] = 'Text entered is too long, '.$this->maxlength.' characters at most';
					break;
					
					case('rpass'):
					case('crpass'):
						if($data['rpass'] != $data['crpass'])
							$error[':'.$key] = 'Passwords must match each other';
						
						if(strlen($data['rpass']) < 5 || strlen($data['crpass']) < 5)
							$error[':'.$key] = 'Password not long enough';
							
						if(strlen($val) > $this->maxlength)
							$error[':'.$key] = 'Text entered is too long, '.$this->maxlength.' characters at most';
					break;
					
					case('hshot'):
						if($data['hshot']['size'] > $this->msize || $data['hshot']['error'] == 1)
							$error[':hshot'] = 'Image is too big, max size is '.(($this->msize/1024)/1024).'MB';
						else{
							if($data['hshot']['error'] == 0){
							$this->imageh = new imageHandler($data['hshot']['tmp_name'],$data['hshot']['size']);
							if(!$this->imageh->isvalid())
								$error[':hshot'] = 'The image you are trying to upload doesn\'t appear to be valid';
							}
						}
					break;
					
				}
			}

				
			return $error;
		}
		
		public function displayName(){
			if($this->isLoggedIn)
			return '<div class="grid-100 mobile-grid-100">Currently Logged in as '.$this->name.' ('.$this->email.')</div>';
			
			return null;
		}
		private function correctZip($zip = null,$iso = null) {
			
			if(!$zip)
				return null;
				
			
			$zip = strtoupper($zip);
			
			$zipsPreg = array(
				"US"=>"^\d{5}([\-]?\d{4})?$",
				"UK"=>"^(GIR|[A-Z]\d[A-Z\d]??|[A-Z]{2}\d[A-Z\d]??)[ ]??(\d[A-Z]{2})$",
				"DE"=>"\b((?:0[1-46-9]\d{3})|(?:[1-357-9]\d{4})|(?:[4][0-24-9]\d{3})|(?:[6][013-9]\d{3}))\b",
				"CA"=>"^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])\ {0,1}(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$",
				"FR"=>"^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$",
				"IT"=>"^(V-|I-)?[0-9]{5}$",
				"AU"=>"^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$",
				"NL"=>"^[1-9][0-9]{3}\s?([a-zA-Z]{2})?$",
				"ES"=>"^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$",
				"DK"=>"^([D-d][K-k])?( |-)?[1-9]{1}[0-9]{3}$",
				"SE"=>"^(s-|S-){0,1}[0-9]{3}\s?[0-9]{2}$",
				"BE"=>"^[1-9]{1}[0-9]{3}$");
				
			if(array_key_exists($iso, $zipsPreg)) {
				if (!preg_match("/".$zipsPreg[$iso]."/i",$zip))
					return false;
				
				return true;
			}else
				return true;
		}
		public function returnPostData(){
			
				
			if(isset($_POST['login']))
				return array_intersect_key($_POST,array_flip(array('email','pass','lin')));
				
			unset($_POST['email']);
			unset($_POST['pass']);
			unset($_POST['lin']);
			if(isset($_FILES['hshot']))
			$_POST['hshot'] = $_FILES['hshot'];
			return $_POST;
		}
		
		private function iserr($key,$array) {
			
			if(isset($array[$key]) && !empty($array[$key]))
				return appCore::returnError($array[$key]);
			
			return null;
			
		}
		
		private function isnerr($key) {
			
			$errArray = $this->errors;
			$postArray = $this->post;
			

			if(isset($errArray[':'.$key]))
				return '';
				
			if(isset($postArray[$key]) && !empty($postArray[$key]))
				return $postArray[$key];
				
			return '';
			
		}
	}

?>